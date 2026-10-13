package com.buzzin.workpermit

import android.annotation.SuppressLint
import android.content.ContentValues
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.util.Base64
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.webkit.WebViewAssetLoader
import java.io.File

/**
 * Hosts the Buzzin Work Permit screens (bundled in assets/www) in a WebView.
 * Pages are served from https://appassets.androidplatform.net so storage and workers behave like a normal site,
 * and nothing is loaded from the network.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var web: WebView
    private var chooserCallback: ValueCallback<Array<Uri>>? = null

    private val chooser = registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
        chooserCallback?.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result.resultCode, result.data))
        chooserCallback = null
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val loader = WebViewAssetLoader.Builder()
            .setDomain(HOST)
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        web = WebView(this)
        setContentView(web)

        web.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = false
            allowContentAccess = false
            mediaPlaybackRequiresUserGesture = true
            cacheMode = WebSettings.LOAD_NO_CACHE
            setSupportZoom(false)
            builtInZoomControls = false
        }
        web.overScrollMode = WebView.OVER_SCROLL_NEVER
        web.addJavascriptInterface(FileBridge(), "AndroidFiles")

        web.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(view: WebView, request: WebResourceRequest): WebResourceResponse? =
                loader.shouldInterceptRequest(request.url)

            override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                // Keep the app's own pages inside the app; open anything else in the phone's browser.
                if (request.url.host == HOST) return false
                runCatching { startActivity(Intent(Intent.ACTION_VIEW, request.url)) }
                return true
            }

            override fun onPageFinished(view: WebView, url: String) {
                // Turn "download" clicks on generated files (blob: URLs) into real files in Downloads.
                view.evaluateJavascript(DOWNLOAD_HOOK, null)
            }
        }

        web.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                view: WebView,
                callback: ValueCallback<Array<Uri>>,
                params: FileChooserParams
            ): Boolean {
                chooserCallback?.onReceiveValue(null)
                chooserCallback = callback
                return try {
                    chooser.launch(params.createIntent())
                    true
                } catch (e: Exception) {
                    chooserCallback = null
                    false
                }
            }
        }

        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                // First let the page close an open popup or dialog, then step back through its screens.
                web.evaluateJavascript("(window.__androidBack && window.__androidBack()) ? 'closed' : 'no'") { r ->
                    if (r != null && r.contains("closed")) return@evaluateJavascript
                    if (web.canGoBack()) web.goBack() else finish()
                }
            }
        })

        if (savedInstanceState != null) web.restoreState(savedInstanceState) else web.loadUrl("https://$HOST/assets/www/index.html")
    }

    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        web.saveState(outState)
    }

    override fun onDestroy() {
        chooserCallback?.onReceiveValue(null)
        web.destroy()
        super.onDestroy()
    }

    /** Receives files made on the page (signed PDFs, exports) and saves them to the Downloads folder. */
    inner class FileBridge {
        @JavascriptInterface
        fun save(name: String, mime: String, base64: String) {
            val bytes = Base64.decode(base64, Base64.DEFAULT)
            val safe = name.replace(Regex("[^A-Za-z0-9._ -]"), "_").ifBlank { "buzzin-file" }
            val ok = runCatching {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    val values = ContentValues().apply {
                        put(MediaStore.Downloads.DISPLAY_NAME, safe)
                        put(MediaStore.Downloads.MIME_TYPE, mime.ifBlank { "application/octet-stream" })
                        put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
                    }
                    val uri = contentResolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)!!
                    contentResolver.openOutputStream(uri)!!.use { it.write(bytes) }
                } else {
                    val dir = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS)!!
                    File(dir, safe).writeBytes(bytes)
                }
            }.isSuccess
            runOnUiThread {
                Toast.makeText(this@MainActivity, if (ok) "Saved $safe to Downloads" else "Could not save the file", Toast.LENGTH_LONG).show()
            }
        }
    }

    companion object {
        private const val HOST = "appassets.androidplatform.net"

        // Runs on every page. Intercepts clicks on <a download href="blob:..."> and hands the bytes to Android.
        private val DOWNLOAD_HOOK = """
            (function () {
              if (window.__dlHook) return; window.__dlHook = true;
              document.addEventListener('click', function (e) {
                var a = e.target.closest && e.target.closest('a[download]');
                if (!a || !/^(blob|data):/.test(a.href)) return;
                e.preventDefault();
                fetch(a.href).then(function (r) { return r.blob(); }).then(function (b) {
                  var fr = new FileReader();
                  fr.onload = function () { AndroidFiles.save(a.download || 'buzzin-file', b.type || '', String(fr.result).split(',')[1] || ''); };
                  fr.readAsDataURL(b);
                });
              }, true);
            })();
        """.trimIndent()
    }
}
