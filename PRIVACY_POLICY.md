# Video Speed — Privacy Policy / Gizlilik Politikası

**Last updated / Son güncelleme:** October 30, 2026 / 30 Ekim 2026  
**Extension / Uzantı:** Video Speed — Playback Controller  
**Chrome Web Store extension ID:** `cmjafmcaccbhfgcjnfldaahebnbbppje`  
**Developer contact / Geliştirici iletişim:** uys.selim@gmail.com

---

## English

### 1. Purpose and scope

Video Speed is a Chrome extension that lets you adjust HTML5 video playback speed using a small on-video controller, keyboard shortcuts, the mouse wheel, and the extension popup. It can remember a separate playback speed and controller position for each website.

This policy describes the behavior of the Video Speed extension itself, based on the current published source code for version 1.2.0. Third-party websites and the Chrome browser may process data under their own separate privacy policies.

### 2. Information processed and why

To provide its video controls, the extension processes the following information **inside your browser**:

- **Website hostname:** The hostname of a page or, where available, its containing website is used to keep settings separate by website. For example, `youtube.com` and `vimeo.com` have independent preferences. The hostname is used in locally stored preference keys. The extension does not store your full browsing URLs or a list of pages visited.
- **Playback speed:** Your preferred numeric video speed (from 0.1× to 16×) is stored for the relevant website.
- **Controller position:** If you move the on-video controller, its relative horizontal and vertical coordinates (numbers between 0 and 1) are stored for that website.
- **Video-player state:** The extension temporarily reads information from HTML5 video elements, such as playback speed, whether a video is playing or paused, its visibility and dimensions, and playback position or duration when needed for seek controls. This information is used to select and control the appropriate video; it is not stored as viewing history.
- **Local user interactions:** The extension responds to supported keyboard shortcuts, mouse-wheel actions, pointer movement and clicks. It temporarily uses recent interaction timing to distinguish deliberate speed changes from automatic player resets. It does **not** save keystroke histories, form entries, passwords, or the contents of what you type.
- **Browser language:** Your browser's language is read to display supported interface text. It is not saved as an analytics profile.

The extension does not require an account, name, email address, or payment information to operate.

### 3. How information is stored and retained

Playback speed and optional controller position are stored using Chrome's `chrome.storage.local` API. Storage keys include the relevant website hostname so that different websites do not overwrite one another's preferences. Tabs on the same website share that website's saved preferences.

These preferences remain on your device across browser restarts until you change them, clear the extension's data, or uninstall the extension. Some unused settings from older versions may remain in local extension storage until that storage is cleared; the current extension does not automatically copy old global preferences to all websites.

Temporary video-player state and recent-input timing are held only in memory as needed while the relevant page or extension interface is active; the extension does not intentionally persist them.

The extension uses local storage rather than the Chrome sync-storage API. It does not operate a separate account-based synchronization or backup service.

### 4. Website access and permissions

Video Speed requests the Chrome `storage` permission to save and retrieve playback preferences. Its content scripts are configured to run on supported pages and frames matching `<all_urls>` because HTML5 videos can appear on many different websites and inside embedded video frames.

On those pages the extension examines video elements and limited page structure necessary to find, display and position its controls and respond to playback events. It is not designed to scrape articles, messages, contacts, search histories, passwords, or other page content. Chrome-restricted pages and some protected players may not support the extension.

The extension popup may use Chrome's tab-messaging APIs to communicate with the active page for video status and playback controls. It does not request the `history`, `cookies`, `identity`, or `webRequest` permissions.

### 5. Data sharing, external services and advertising

The current extension has no developer-operated backend, third-party analytics SDK, advertising SDK, or account service. **Video Speed does not intentionally send website hostnames, saved preferences, video information, or user interactions to the developer or to external servers.**

The extension does not sell or rent user data, use it for personalized advertising, or disclose it to data brokers or advertising networks. There are no third parties to which the extension intentionally transfers this information.

Chrome and the websites you visit operate independently of Video Speed and may process information according to their own policies. Adjustments to playback are made on video elements within the visited page.

### 6. Security and data minimization

Video Speed is designed to process only the information needed to identify and control HTML5 videos and remember website-specific preferences. Its playback logic runs locally in the browser. The extension does not download or execute remotely hosted application code as part of its described functionality.

Saved preferences are subject to the security of your browser profile and device. Video Speed does not separately encrypt the information saved using `chrome.storage.local`; users should protect their device and Chrome profile.

### 7. Your choices and data deletion

You can change a website's preferred playback speed at any time using the video controller or popup. You can move the controller to replace its saved position.

To delete saved Video Speed preferences, clear the extension's stored data through Chrome's available extension/browser controls, or uninstall Video Speed. Uninstalling the extension removes its extension-managed local storage under Chrome's normal extension data lifecycle. Deleting your browser history alone should **not** be assumed to remove these settings.

For a question about stored information or privacy, contact the developer using the email address listed above. Because Video Speed does not receive your local preferences, the developer generally cannot access or remotely delete the contents of your browser's extension storage.

### 8. Chrome Web Store Limited Use statement

**The use of information received from Google APIs will adhere to the Chrome Web Store User Data Policy, including the Limited Use requirements.** Any information accessed by Video Speed is used only for its disclosed, user-facing purpose of controlling HTML5 video playback and remembering related preferences. It is not used for unrelated purposes, advertising personalization, or sale of data.

### 9. Policy updates and contact

This policy may be updated if the extension's features, permissions, or data handling change. The revision date at the top of this page will be updated accordingly. Material changes to data practices will be disclosed as required by applicable Chrome Web Store policies and law.

**Contact:** uys.selim@gmail.com  
**Source and support:** https://github.com/SelimUysal/video-speed

---

## Türkçe

### 1. Amaç ve kapsam

Video Speed; HTML5 videolarının hızını video üzerindeki küçük kontrol paneli, klavye kısayolları, fare tekerleği ve Chrome uzantısı açılır penceresiyle değiştirmeyi sağlayan bir tarayıcı uzantısıdır. Her internet sitesi için oynatma hızını ve kontrol panelinin konumunu ayrı ayrı hatırlayabilir.

Bu politika, Video Speed 1.2.0 sürümünün mevcut kaynak koduna göre uzantının kendi veri işleme davranışını açıklar. Ziyaret edilen internet siteleri ve Chrome tarayıcısı kendi gizlilik politikalarına göre ayrıca veri işleyebilir.

### 2. İşlenen bilgiler ve amaçları

Uzantı yalnızca işlevlerini yerine getirmek için aşağıdaki bilgileri **tarayıcınızın içinde** işler:

- **Site alan adı:** Örneğin `youtube.com` ve `vimeo.com` için farklı ayarlar saklanabilmesi amacıyla sitenin alan adı kullanılır. Gömülü video oynatıcılarda, tarayıcının izin verdiği durumlarda üst sitenin alan adı esas alınabilir. Bu bilgi yerel ayar anahtarında bulunur. Tam sayfa URL'leri veya ziyaret edilen sayfaların listesi kaydedilmez.
- **Oynatma hızı:** Site için seçtiğiniz 0.1×–16× aralığındaki hız değeri yerel olarak saklanır.
- **Panel konumu:** Paneli taşıdığınızda yatay ve dikey göreli koordinatları (0–1 arasında iki sayı) ilgili site için saklanır.
- **Video durumu:** Uygun videoyu bulmak ve kontrol etmek amacıyla videonun oynatma hızı, oynatılıp oynatılmadığı, görünürlüğü, boyutları ve ileri/geri sarma gerektiğinde oynatma zamanı veya süresi geçici olarak okunur. İzleme geçmişi oluşturulmaz.
- **Kullanıcı etkileşimleri:** Desteklenen klavye kısayolları, fare tekerleği ve tıklamalar işlenir. Sitenin kendi hız ayarını algılamak için son etkileşimlerin zamanı kısa süreli olarak bellekte tutulabilir. Basılan tuşların geçmişi, yazılan metinler, şifreler veya form içerikleri saklanmaz.
- **Tarayıcı dili:** Arayüzün uygun dilde gösterilmesi için okunur; analiz profili olarak saklanmaz.

Uzantıyı kullanmak için hesap açmanız veya ad, e-posta adresi ya da ödeme bilgisi vermeniz gerekmez.

### 3. Verilerin saklanması ve saklama süresi

Siteye özel hız ve panel konumu Chrome'un `chrome.storage.local` mekanizmasında, cihazınızdaki uzantı verileri arasında saklanır. Aynı sitenin farklı sekmeleri ortak ayarları kullanabilir; farklı siteler birbirlerinin ayarlarını değiştirmez.

Bu tercihler siz değiştirinceye, uzantı verilerini temizleyinceye veya uzantıyı kaldırıncaya kadar tarayıcı kapatılıp açılsa da korunabilir. Eski sürümlerden kalan kullanılmayan ayarlar depolama temizlenene kadar mevcut olabilir; eski ortak tercihler otomatik olarak bütün sitelere kopyalanmaz.

Geçici video durumu ve etkileşim zamanları, ihtiyaç duyulduğunda yalnızca bellekte kullanılır; kalıcı izleme kaydı olarak saklanmaz.

Uzantı `chrome.storage.sync` kullanmaz; geliştirici tarafından sağlanan bir hesap, bulut yedekleme veya eşitleme hizmeti bulunmaz.

### 4. Site erişimi ve Chrome izinleri

`storage` izni hız ve konum tercihlerini kaydetmek için kullanılır. `<all_urls>` eşleşmesi, HTML5 videoların farklı sitelerde ve gömülü video çerçevelerinde bulunabilmesi nedeniyle içerik betiklerinin desteklenen web sayfalarında çalışmasını sağlar.

Uzantı, video öğelerini ve kontrol panelini yerleştirmek için gerekli sınırlı sayfa yapısını inceler. Makale metinlerini, mesajları, kişileri, arama geçmişini, şifreleri veya sayfadaki ilgisiz içerikleri toplamak için tasarlanmamıştır. Chrome'un kısıtladığı sayfalarda veya korumalı oynatıcılarda çalışmayabilir.

Popup, aktif sayfaya video durumunu sormak ve oynatma komutları göndermek amacıyla Chrome'un sekme mesajlaşma işlevlerini kullanabilir. Uzantı `history`, `cookies`, `identity` veya `webRequest` izinlerini istemez.

### 5. Üçüncü taraflarla paylaşım ve reklam

Mevcut uzantıda geliştirici sunucusu, üçüncü taraf analiz SDK'sı, reklam SDK'sı veya hesap hizmeti yoktur. **Video Speed; site alan adlarını, kaydedilen tercihleri, video bilgilerini veya kullanıcı etkileşimlerini geliştiriciye ya da harici sunuculara bilerek göndermez.**

Veriler satılmaz, kiralanmaz, kişiselleştirilmiş reklam için kullanılmaz veya veri aracılarına aktarılmaz. Uzantının bu bilgileri bilerek aktardığı bir üçüncü taraf bulunmamaktadır.

Chrome tarayıcısı ve ziyaret ettiğiniz internet siteleri Video Speed'den bağımsız olarak kendi kurallarına göre veri işleyebilir. Uzantının yaptığı hız değişiklikleri, ziyaret edilen sayfadaki video öğeleri üzerinde uygulanır.

### 6. Güvenlik ve veri minimizasyonu

Video Speed yalnızca HTML5 videolarını bulmak, kontrol etmek ve siteye özel tercihleri hatırlamak için gereken bilgileri işlemeyi amaçlar. Oynatma kontrolü tarayıcınızda yerel olarak gerçekleştirilir. Açıklanan işlevler için uzaktan barındırılan çalıştırılabilir uygulama kodu kullanılmaz.

Yerel tercihlerinizin güvenliği, Chrome profilinizin ve cihazınızın güvenliğine bağlıdır. Video Speed, `chrome.storage.local` içine kaydettiği bilgileri ayrıca şifrelemez; cihazınızı ve Chrome profilinizi korumanız önerilir.

### 7. Kullanıcı tercihleri ve veri silme

Hızı istediğiniz zaman panelden veya popup ekranından değiştirebilir, paneli sürükleyerek konumunu güncelleyebilirsiniz.

Kaydedilmiş verileri silmek için Chrome'un desteklediği uzantı verisi temizleme yöntemlerini kullanabilir veya Video Speed'i kaldırabilirsiniz. Uzantı kaldırıldığında Chrome'un olağan uzantı veri yaşam döngüsü kapsamında uzantıya ait yerel depolama da kaldırılır. **Yalnızca tarayıcı geçmişini silmek**, bu ayarların silindiği anlamına gelmez.

Gizlilik konusunda sorularınız için aşağıdaki e-posta adresinden geliştiriciye ulaşabilirsiniz. Tercihler geliştiriciye gönderilmediği için geliştirici bu verilere uzaktan erişemez veya onları uzaktan silemez.

### 8. Chrome Web Store Sınırlı Kullanım (Limited Use) beyanı

**Google API'lerinden elde edilen bilgilerin kullanımı, Sınırlı Kullanım (Limited Use) gereklilikleri dahil Chrome Web Store Kullanıcı Verileri Politikası'na uygun olacaktır.** Video Speed'in eriştiği bilgiler yalnızca açıklanan HTML5 video kontrolü ve ilgili tercihleri hatırlama amacıyla kullanılır. İlgisiz amaçlar, kişiselleştirilmiş reklamlar veya veri satışı için kullanılmaz.

### 9. Politika değişiklikleri ve iletişim

Uzantının özellikleri, izinleri veya veri işleme yöntemleri değişirse bu politika güncellenebilir; sayfanın üstündeki güncelleme tarihi buna göre değiştirilecektir. Veri kullanımındaki önemli değişiklikler, ilgili Chrome Web Store kuralları ve yürürlükteki mevzuat gereğince duyurulur.

**İletişim:** uys.selim@gmail.com  
**Kaynak kod ve destek:** https://github.com/SelimUysal/video-speed
