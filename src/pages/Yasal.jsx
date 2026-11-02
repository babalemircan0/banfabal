import { Link } from 'react-router-dom'
import '../css/Yasal.css'

const EPOSTA = 'destek@banfabal.com'
const GUNCELLEME = '2 Kasım 2026'

const ICERIKLER = {
  kvkk: {
    baslik: 'KVKK Aydınlatma Metni',
    ozet:
      '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verilerinizin hangi amaçlarla ve nasıl işlendiğine ilişkin bilgilendirmedir.',
    bolumler: [
      {
        baslik: 'Veri sorumlusu ve kapsam',
        paragraflar: [
          'Bu aydınlatma metni, Banfabal platformu üzerinden sunulan hizmetler kapsamında işlenen kişisel verileriniz için geçerlidir. Veri sorumlusu Banfabal’dır.',
          `Sorularınız ve talepleriniz için ${EPOSTA} adresinden bizimle iletişime geçebilirsiniz.`,
        ],
      },
      {
        baslik: 'İşlenen kişisel veriler',
        liste: [
          'Kimlik ve iletişim bilgileri: ad soyad, e-posta adresi, hesap bilgileri.',
          'İlan bilgileri: ilan başlığı, açıklaması, konum, fiyat, metrekare, tapu ve kadastro bilgileri, fotoğraflar.',
          'İletişim kayıtları: alıcı ve satıcı arasındaki mesajlar, ilan yorumları.',
          'İşlem güvenliği bilgileri: oturum bilgileri, IP adresi, tarayıcı ve cihaz bilgileri, hata kayıtları.',
        ],
      },
      {
        baslik: 'Kişisel verilerin işlenme amaçları',
        liste: [
          'Üyelik oluşturulması, hesap yönetimi ve kimlik doğrulama.',
          'İlanların yayınlanması, görüntülenmesi ve yönetilmesi.',
          'Alıcı ve satıcı arasındaki iletişimin sağlanması.',
          'Platform güvenliğinin sağlanması, kötüye kullanımın önlenmesi.',
          'Yasal yükümlülüklerin yerine getirilmesi ve taleplerin yanıtlanması.',
          'Hizmet kalitesinin ölçülmesi ve platformun geliştirilmesi.',
        ],
      },
      {
        baslik: 'Hukuki sebepler',
        paragraflar: [
          'Kişisel verileriniz; sözleşmenin kurulması veya ifası, hukuki yükümlülüklerin yerine getirilmesi, meşru menfaatlerimiz ve gerekli hallerde açık rızanız hukuki sebeplerine dayanılarak işlenir.',
        ],
      },
      {
        baslik: 'Kişisel verilerin aktarılması',
        paragraflar: [
          'Hizmetin sunulabilmesi için verileriniz barındırma, veritabanı, dosya depolama ve e-posta gönderimi gibi hizmet sağlayıcılarıyla paylaşılabilir. Bu sağlayıcılar arasında Supabase ve Vercel gibi altyapı hizmetleri yer alabilir.',
          'Yetkili kamu kurum ve kuruluşlarına, hukuki bir yükümlülük bulunması halinde mevzuata uygun olarak aktarım yapılabilir. Yurt dışında sunucu bulunan hizmet sağlayıcıları kullanılması halinde aktarım, KVKK’nın ilgili hükümlerine uygun şekilde gerçekleştirilir.',
        ],
      },
      {
        baslik: 'Saklama süresi ve güvenlik',
        paragraflar: [
          'Kişisel verileriniz, işleme amaçlarının gerektirdiği süre ve yasal saklama yükümlülükleri boyunca saklanır. Hesabınızı silmeniz halinde, yasal olarak saklanması gereken veriler dışındaki kayıtlar silinir veya anonim hale getirilir.',
          'Verilerin yetkisiz erişime, kayba ve kötüye kullanıma karşı korunması için erişim kontrolü, satır düzeyi güvenlik politikaları ve şifreli iletişim gibi teknik ve idari önlemler uygulanır.',
        ],
      },
      {
        baslik: 'KVKK kapsamındaki haklarınız',
        paragraflar: ['KVKK’nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:'],
        liste: [
          'Kişisel verilerinizin işlenip işlenmediğini öğrenme.',
          'İşlenmişse buna ilişkin bilgi talep etme.',
          'İşlenme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme.',
          'Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme.',
          'Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme.',
          'Koşulları oluştuğunda verilerin silinmesini veya yok edilmesini isteme.',
          'Düzeltme ve silme işlemlerinin aktarıldığı üçüncü kişilere bildirilmesini isteme.',
          'Otomatik sistemlerle analiz sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme.',
          'Kanuna aykırı işleme nedeniyle zarara uğramanız halinde zararın giderilmesini talep etme.',
        ],
      },
      {
        baslik: 'Başvuru ve iletişim',
        paragraflar: [
          `Haklarınıza ilişkin taleplerinizi ${EPOSTA} adresine iletebilirsiniz. Talebiniz, kimliğinizi doğrulayan bilgilerle birlikte değerlendirilir ve yasal süreler içinde yanıtlanır.`,
        ],
      },
    ],
  },
  gizlilik: {
    baslik: 'Gizlilik Politikası',
    ozet:
      'Banfabal’ı kullanırken hangi bilgileri topladığımızı, bu bilgileri nasıl kullandığımızı ve haklarınızı açıklar.',
    bolumler: [
      {
        baslik: 'Genel bilgilendirme',
        paragraflar: [
          'Bu gizlilik politikası, Banfabal platformunu ziyaret ettiğinizde veya üye olduğunuzda paylaştığınız bilgilerin nasıl işlendiğini açıklar. Platformu kullanarak bu politikada açıklanan uygulamaları kabul etmiş olursunuz.',
        ],
      },
      {
        baslik: 'Topladığımız bilgiler',
        liste: [
          'Hesap bilgileri: ad soyad, e-posta adresi ve kimlik doğrulama bilgileri.',
          'İlan bilgileri: ilan içeriği, konum, fiyat, arsa özellikleri ve yüklediğiniz fotoğraflar.',
          'İletişim bilgileri: platform üzerinden gönderdiğiniz mesajlar ve yorumlar.',
          'Teknik bilgiler: oturum bilgileri, IP adresi, tarayıcı türü, cihaz bilgisi ve hata kayıtları.',
        ],
      },
      {
        baslik: 'Bilgileri kullanma amaçlarımız',
        liste: [
          'Hesabınızı oluşturmak ve güvenli bir şekilde yönetmek.',
          'İlanlarınızı yayınlamak ve alıcılarla iletişim kurmanızı sağlamak.',
          'Platformun güvenliğini ve işleyişini sağlamak.',
          'Talep ve sorunlarınıza destek vermek.',
          'Yasal yükümlülüklerimizi yerine getirmek.',
          'Hizmetlerimizi geliştirmek ve kullanım deneyimini iyileştirmek.',
        ],
      },
      {
        baslik: 'Çerezler ve yerel depolama',
        paragraflar: [
          'Oturumunuzu sürdürmek için tarayıcınızın yerel depolama alanında kimlik doğrulama bilgileri saklanır. Zorunlu olmayan analitik veya pazarlama çerezleri kullanılması halinde bu politika ve çerez tercihleri güncellenir.',
          'Detaylı bilgi için Çerez Politikası sayfamızı inceleyebilirsiniz.',
        ],
      },
      {
        baslik: 'Üçüncü taraf hizmetler',
        paragraflar: [
          'Platformun altyapısı için Supabase (veritabanı, kimlik doğrulama, dosya depolama ve gerçek zamanlı iletişim) ve Vercel (barındırma) gibi hizmet sağlayıcılarından yararlanıyoruz. Bu sağlayıcılar, hizmetin sunulması için gerekli verileri kendi gizlilik politikaları kapsamında işleyebilir.',
        ],
      },
      {
        baslik: 'Veri güvenliği',
        paragraflar: [
          'Verilerinizi yetkisiz erişim, değiştirme, ifşa veya imhaya karşı korumak için erişim kontrolü, satır düzeyi güvenlik politikaları, şifreli bağlantılar ve düzenli güvenlik kontrolleri gibi önlemler uygularız. Ancak internet üzerinden yapılan hiçbir veri aktarımının tamamen güvenli olduğu garanti edilemez.',
        ],
      },
      {
        baslik: 'Çocukların gizliliği',
        paragraflar: [
          'Platform 18 yaşından küçük kullanıcılara yönelik değildir. 18 yaşından küçük olduğunuzu düşünüyorsanız platformu kullanmamanız ve bizimle iletişime geçmeniz gerekir.',
        ],
      },
      {
        baslik: 'Haklarınız ve iletişim',
        paragraflar: [
          `Verilerinize ilişkin bilgi alma, düzeltme, silme ve itiraz taleplerinizi ${EPOSTA} adresine iletebilirsiniz. Talepleriniz yasal süreler içinde değerlendirilir.`,
        ],
      },
    ],
  },
  'kullanim-sartlari': {
    baslik: 'Kullanım Şartları',
    ozet:
      'Banfabal platformunu kullanırken uymanız gereken kuralları ve hizmetin kapsamını açıklar.',
    bolumler: [
      {
        baslik: 'Hizmetin tanımı',
        paragraflar: [
          'Banfabal, kullanıcıların arsa ve arazi ilanları yayınlayabildiği, ilanları inceleyebildiği ve birbirleriyle iletişim kurabildiği bir çevrimiçi pazaryeri platformudur.',
          'Banfabal, ilanlarda yer alan bilgilerin doğruluğunu garanti etmez ve alıcı ile satıcı arasındaki işlemin tarafı değildir. İlan içeriğinden ve satış sürecinden ilgili kullanıcılar sorumludur.',
        ],
      },
      {
        baslik: 'Üyelik ve hesap güvenliği',
        liste: [
          'Platforma üye olurken doğru ve güncel bilgiler vermelisiniz.',
          'Hesap bilgilerinizin ve şifrenizin gizliliğinden siz sorumlusunuz.',
          'Hesabınız üzerinden gerçekleştirilen işlemlerden haberdar olmadığınızı düşünüyorsanız derhal bizimle iletişime geçmelisiniz.',
          'Hesabınızı üçüncü kişilerle paylaşmamalı veya başkası adına hesap oluşturmamalısınız.',
        ],
      },
      {
        baslik: 'İlan kuralları',
        liste: [
          'İlanlar gerçek, güncel ve yanıltıcı olmayan bilgiler içermelidir.',
          'Yalnızca yayınlama hakkına sahip olduğunuz fotoğraf ve bilgileri kullanmalısınız.',
          'Aynı ilanı farklı başlıklarla tekrar tekrar yayınlamamalısınız.',
          'Fiyat, metrekare, konum ve tapu bilgileri mümkün olduğunca eksiksiz belirtilmelidir.',
          'Yasadışı, dolandırıcılık amaçlı, nefret söylemi içeren veya üçüncü kişilerin haklarını ihlal eden ilanlar yayınlanamaz.',
        ],
      },
      {
        baslik: 'Yasaklı içerik ve davranışlar',
        liste: [
          'Başkalarını taciz etmek, tehdit etmek veya ayrımcılık yapmak.',
          'Sahte hesap oluşturmak, platformun güvenliğini aşmaya çalışmak veya otomatik araçlarla izinsiz veri toplamak.',
          'Virüs, zararlı yazılım veya platformun çalışmasını bozacak içerik paylaşmak.',
          'Başkalarının kişisel bilgilerini izinsiz paylaşmak.',
          'Platformu yasadışı bir amaç için kullanmak.',
        ],
      },
      {
        baslik: 'İlanların doğruluğu ve sorumluluk',
        paragraflar: [
          'İlanlarda yer alan bilgiler ilan sahibi tarafından sağlanır. Banfabal, ilan içeriklerinin doğruluğunu, güncelliğini veya satışa uygunluğunu garanti etmez. Kullanıcılar, ilan sahibiyle iletişime geçmeden ve gerekli hukuki kontrolleri yapmadan ödeme veya taahhütte bulunmamalıdır.',
          'Banfabal, kullanıcılar arasındaki anlaşmazlıklardan doğrudan sorumlu tutulamaz. Ancak güvenliğin sağlanması için gerekli gördüğü hallerde içerikleri kaldırabilir veya hesapları askıya alabilir.',
        ],
      },
      {
        baslik: 'Fikri mülkiyet',
        paragraflar: [
          'Platformun tasarımı, logosu, yazılımı ve içerikleri Banfabal’a veya ilgili hak sahiplerine aittir. İzinsiz kopyalanamaz, çoğaltılamaz veya ticari amaçla kullanılamaz. Kullanıcıların yüklediği içeriklerin hakları ilgili kullanıcıya aittir; platform bu içerikleri hizmetin sunulması amacıyla görüntüleyebilir.',
        ],
      },
      {
        baslik: 'Hizmetin askıya alınması ve değişiklikler',
        paragraflar: [
          'Banfabal, bu şartlara uymayan hesapları veya ilanları önceden bildirimde bulunmaksızın kaldırma, askıya alma veya silme hakkını saklı tutar.',
          'Hizmetlerde ve bu şartlarda zaman zaman değişiklik yapılabilir. Önemli değişiklikler platform üzerinden duyurulur. Değişikliklerden sonra platformu kullanmaya devam etmeniz, güncel şartları kabul ettiğiniz anlamına gelir.',
        ],
      },
      {
        baslik: 'Uygulanacak hukuk ve iletişim',
        paragraflar: [
          `Bu şartlar Türkiye Cumhuriyeti hukukuna tabidir. Sorularınız için ${EPOSTA} adresinden bizimle iletişime geçebilirsiniz.`,
        ],
      },
    ],
  },
  'cerez-politikasi': {
    baslik: 'Çerez Politikası',
    ozet:
      'Banfabal’da çerezler ve tarayıcı yerel depolama alanının hangi amaçlarla kullanıldığını açıklar.',
    bolumler: [
      {
        baslik: 'Çerez nedir?',
        paragraflar: [
          'Çerezler, ziyaret ettiğiniz web sitelerinin tarayıcınıza kaydettiği küçük metin dosyalarıdır. Benzer şekilde tarayıcı yerel depolama alanı (localStorage) da küçük verilerin cihazınızda saklanmasını sağlar.',
        ],
      },
      {
        baslik: 'Kullandığımız çerezler ve yerel depolama',
        paragraflar: [
          'Banfabal’da temel olarak oturum yönetimi için Supabase kimlik doğrulama bilgileri tarayıcı yerel depolama alanında saklanır. Bu bilgiler, giriş yaptığınızda oturumunuzun açık kalmasını ve hesabınıza güvenli erişimi sağlar.',
        ],
      },
      {
        baslik: 'Zorunlu çerezler',
        paragraflar: [
          'Kimlik doğrulama ve oturum yönetimi için kullanılan zorunlu saklama alanları olmadan platforma giriş yapamaz ve mesajlaşma gibi üyelik gerektiren özellikleri kullanamazsınız. Bu nedenle bu saklama alanları hizmetin sunulması için gereklidir.',
        ],
      },
      {
        baslik: 'Analitik ve pazarlama çerezleri',
        paragraflar: [
          'Şu anda platformda reklam veya pazarlama amaçlı üçüncü taraf çerezleri kullanılmamaktadır. İleride analitik veya pazarlama araçları eklenirse bu politika güncellenecek ve gerekli bilgilendirme/onay süreçleri uygulanacaktır.',
        ],
      },
      {
        baslik: 'Çerezleri nasıl yönetebilirsiniz?',
        paragraflar: [
          'Tarayıcınızın ayarlarından çerezleri ve yerel depolama alanını silebilir veya engelleyebilirsiniz. Ancak zorunlu saklama alanlarını engellemeniz halinde oturum açma ve platformun üyelik gerektiren özellikleri çalışmayabilir.',
        ],
      },
      {
        baslik: 'Güncellemeler ve iletişim',
        paragraflar: [
          `Bu çerez politikası ${GUNCELLEME} tarihinde güncellenmiştir. Sorularınız için ${EPOSTA} adresinden bizimle iletişime geçebilirsiniz.`,
        ],
      },
    ],
  },
}

export default function Yasal({ tur }) {
  const icerik = ICERIKLER[tur] || ICERIKLER.gizlilik

  return (
    <div className="yasal-page">
      <article className="yasal-card">
        <p className="yasal-eyebrow">Banfabal · Yasal</p>
        <h1>{icerik.baslik}</h1>
        <p className="yasal-update">Son güncelleme: {GUNCELLEME}</p>
        <p className="yasal-ozet">{icerik.ozet}</p>

        {icerik.bolumler.map((bolum) => (
          <section key={bolum.baslik}>
            <h2>{bolum.baslik}</h2>
            {bolum.paragraflar?.map((paragraf) => (
              <p key={paragraf}>{paragraf}</p>
            ))}
            {bolum.liste && (
              <ul>
                {bolum.liste.map((madde) => (
                  <li key={madde}>{madde}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className="yasal-footnote">
          Bu metinle ilgili sorularınız için <a href={`mailto:${EPOSTA}`}>{EPOSTA}</a> adresine yazabilirsiniz.{' '}
          <Link to="/">Ana sayfaya dön</Link>
        </p>
      </article>
    </div>
  )
}
