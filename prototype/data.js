const memberCompanyPlaceholders = [
  ["member-07", "会員企業 07", "飲食", "下府", "食事やテイクアウトで地域の暮らしを支えるお店", ["掲載準備中", "飲食", "地域のお店"]],
  ["member-08", "会員企業 08", "小売", "美咲", "日々の買い物や暮らしの相談ができる町のお店", ["掲載準備中", "小売", "暮らし"]],
  ["member-09", "会員企業 09", "建設", "三代", "住まいや店舗の工事・修繕を相談できる事業者", ["掲載準備中", "建設", "見積相談"]],
  ["member-10", "会員企業 10", "美容", "中央駅前", "ヘアケアや身だしなみを相談できる地域の美容サービス", ["掲載準備中", "美容", "予約相談"]],
  ["member-11", "会員企業 11", "健康", "緑ケ浜", "体のケアや健康づくりを身近に相談できる事業者", ["掲載準備中", "健康", "相談可"]],
  ["member-12", "会員企業 12", "サービス", "夜臼", "暮らしや仕事の困りごとを支える地域サービス", ["掲載準備中", "サービス", "法人対応"]],
  ["member-13", "会員企業 13", "製造", "原上", "ものづくりや加工技術で地域の産業を支える事業者", ["掲載準備中", "製造", "法人対応"]],
  ["member-14", "会員企業 14", "運輸", "上府", "配送や移動に関する地域の事業活動を支える会社", ["掲載準備中", "運輸", "事業者向け"]],
  ["member-15", "会員企業 15", "不動産", "新宮東", "住まいや店舗探しを地域目線で相談できる事業者", ["掲載準備中", "不動産", "相談可"]],
  ["member-16", "会員企業 16", "飲食", "湊", "家族や仕事帰りに立ち寄れる地域の飲食店", ["掲載準備中", "飲食", "地域のお店"]],
  ["member-17", "会員企業 17", "小売", "下府", "生活用品や専門商品を身近に探せる町のお店", ["掲載準備中", "小売", "暮らし"]],
  ["member-18", "会員企業 18", "建設", "的野", "住宅・店舗・設備まわりの相談ができる事業者", ["掲載準備中", "建設", "修繕相談"]],
  ["member-19", "会員企業 19", "サービス", "美咲", "個人利用から法人相談まで対応する地域サービス", ["掲載準備中", "サービス", "相談可"]],
  ["member-20", "会員企業 20", "医療・福祉", "中央駅前", "日々の安心を支える医療・福祉関連の事業者", ["掲載準備中", "医療・福祉", "地域密着"]],
  ["member-21", "会員企業 21", "教育", "新宮東", "学びや体験を通じて地域の人を支える事業者", ["掲載準備中", "教育", "子育て"]],
  ["member-22", "会員企業 22", "飲食", "夜臼", "ランチや会食で利用できる地域の飲食店", ["掲載準備中", "飲食", "ランチ"]],
  ["member-23", "会員企業 23", "小売", "緑ケ浜", "商品選びから相談まで頼れる地域のお店", ["掲載準備中", "小売", "相談可"]],
  ["member-24", "会員企業 24", "自動車", "原上", "車の購入・整備・点検を相談できる事業者", ["掲載準備中", "自動車", "点検相談"]],
  ["member-25", "会員企業 25", "専門サービス", "上府", "士業・専門相談など事業運営を支えるサービス", ["掲載準備中", "専門相談", "法人対応"]],
  ["member-26", "会員企業 26", "美容", "下府", "地域で長く通える美容・リラクゼーションサービス", ["掲載準備中", "美容", "予約相談"]],
  ["member-27", "会員企業 27", "建設", "三代", "店舗や住宅の工事相談に対応する地域事業者", ["掲載準備中", "建設", "法人対応"]],
  ["member-28", "会員企業 28", "サービス", "湊", "日常の手続きや困りごとを支える地域サービス", ["掲載準備中", "サービス", "暮らし"]],
  ["member-29", "会員企業 29", "製造", "的野", "地域のものづくりを支える加工・製造関連の会社", ["掲載準備中", "製造", "事業者向け"]],
  ["member-30", "会員企業 30", "飲食", "美咲", "地元で気軽に利用できる飲食・テイクアウトのお店", ["掲載準備中", "飲食", "テイクアウト"]],
  ["member-31", "会員企業 31", "小売", "中央駅前", "駅周辺で暮らしに必要な商品を探せるお店", ["掲載準備中", "小売", "駅近"]],
  ["member-32", "会員企業 32", "健康", "新宮東", "健康づくりや体のメンテナンスを相談できる事業者", ["掲載準備中", "健康", "相談可"]],
  ["member-33", "会員企業 33", "サービス", "緑ケ浜", "地域の事業者と住民を支える生活関連サービス", ["掲載準備中", "サービス", "地域密着"]]
].map(([id, name, category, area, catchcopy, tags], index) => ({
  id,
  name,
  category,
  area,
  plan: "基本情報",
  planRank: 5,
  detailPage: false,
  catchcopy,
  description: "詳しい紹介文、連絡先、営業時間は確認後に順次更新します。現在は基本情報を確認できる事業者として掲載しています。",
  tags,
  phone: "確認中",
  email: "確認中",
  address: `福岡県糟屋郡新宮町${area}（確認中）`,
  hours: "確認中",
  closed: "確認中",
  website: "",
  instagram: "",
  parking: false,
  payment: ["確認中"],
  image: [
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
  ][index % 5],
  examples: ["掲載準備中"]
}));

window.SHINGU_DATA = {
  businesses: [
    {
      id: "shingu-bakery",
      name: "しんぐうベーカリー",
      category: "飲食",
      area: "新宮町中央",
      plan: "詳しい紹介あり",
      planRank: 1,
      detailPage: true,
      catchcopy: "朝から焼きたてパンを楽しめる地域のベーカリー",
      description:
        "通勤前や休日の朝に立ち寄りやすい、地域密着のベーカリー。季節の素材を使ったパンと、家族で楽しめる惣菜パンをそろえています。",
      tags: ["駐車場あり", "朝営業", "テイクアウト"],
      phone: "092-000-0000",
      email: "info@shingu-bakery.example",
      address: "福岡県糟屋郡新宮町中央駅前1-1-1",
      hours: "7:30-18:00",
      closed: "水曜",
      website: "https://example.com",
      instagram: "https://instagram.com",
      parking: true,
      payment: ["カード", "QR"],
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1506459225024-1428097a7e18?auto=format&fit=crop&w=1200&q=80"
      ],
      examples: ["季節のフルーツデニッシュ", "地元野菜の惣菜パン", "朝食セット"],
      cases: [
        {
          title: "朝食セットの販売開始",
          text: "近隣で働く方や通学前の学生が立ち寄りやすいよう、ドリンク付きの朝食セットを用意。"
        },
        {
          title: "地元野菜を使った惣菜パン",
          text: "季節ごとに町内外の素材を取り入れ、家族で選ぶ楽しさをつくっています。"
        }
      ]
    },
    {
      id: "shingu-home-builder",
      name: "新宮住まい工務店",
      category: "建設",
      area: "三代",
      plan: "10万円プラン",
      planRank: 1.5,
      detailPage: true,
      catchcopy: "新築・リフォーム・修繕まで相談しやすい町の工務店",
      description:
        "新宮町で住まいの小さな修繕から店舗内装、リフォーム相談まで対応する地域密着の工務店。現地確認から見積もり、施工後の相談まで、顔の見える距離感を大切にしています。",
      tags: ["10万円プラン", "施工事例あり", "法人対応", "見積相談"],
      phone: "092-000-1111",
      email: "info@shingu-builder.example",
      address: "福岡県糟屋郡新宮町三代2-2-2",
      hours: "9:00-17:30",
      closed: "日曜",
      website: "https://example.com",
      instagram: "",
      parking: true,
      payment: ["振込"],
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
      ],
      examples: ["水回りリフォーム", "店舗内装", "外壁修繕"],
      cases: [
        {
          title: "水回りの小さな修繕相談",
          text: "毎日使う場所だからこそ、気になる不具合を早めに相談できる体制を整えています。現地確認後、必要な工事範囲を分かりやすく説明します。"
        },
        {
          title: "店舗内装の部分改修",
          text: "営業を続けながら進めたい改修や、限られた予算で印象を変えたい相談にも対応。動線や見せ方を一緒に確認します。"
        },
        {
          title: "外壁・雨まわりの点検",
          text: "台風や雨の季節に備え、外壁や雨どいまわりの確認も相談できます。地域の気候を踏まえた提案を大切にしています。"
        }
      ]
    },
    {
      id: "minato-seikotsu",
      name: "みなと整骨院",
      category: "健康",
      area: "下府",
      plan: "基本情報",
      planRank: 3,
      detailPage: false,
      catchcopy: "仕事帰りにも通いやすい予約対応の整骨院",
      description:
        "肩こり、腰痛、スポーツ後のケアなど、日常の体の不調を相談できます。予約優先で待ち時間を抑えた運営を行っています。",
      tags: ["予約可", "夜営業", "駅近"],
      phone: "092-000-2222",
      email: "info@minato-seikotsu.example",
      address: "福岡県糟屋郡新宮町下府3-3-3",
      hours: "10:00-20:00",
      closed: "木曜",
      website: "",
      instagram: "https://instagram.com",
      parking: false,
      payment: ["現金", "QR"],
      image:
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=80",
      examples: ["姿勢相談", "スポーツケア"]
    },
    {
      id: "sakura-hair",
      name: "さくら美容室",
      category: "美容",
      area: "美咲",
      plan: "基本情報",
      planRank: 3,
      detailPage: false,
      catchcopy: "家族で通える、落ち着いた雰囲気の美容室",
      description:
        "カット、カラー、ヘアケアまで相談しやすい美容室。地域の方が長く通える丁寧な接客を大切にしています。",
      tags: ["予約可", "Instagramあり", "女性スタッフ"],
      phone: "092-000-3333",
      email: "info@sakura-hair.example",
      address: "福岡県糟屋郡新宮町美咲4-4-4",
      hours: "9:30-18:30",
      closed: "月曜",
      website: "https://example.com",
      instagram: "https://instagram.com",
      parking: true,
      payment: ["カード", "QR"],
      image:
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80",
      examples: ["カット", "カラー", "ヘッドスパ"]
    },
    {
      id: "machi-electric",
      name: "まちの電器店",
      category: "小売",
      area: "夜臼",
      plan: "基本情報",
      planRank: 4,
      detailPage: false,
      catchcopy: "家電の購入から設置、ちょっとした相談まで",
      description:
        "家電販売、設置、修理相談を行う地域密着の電器店。高齢の方にも分かりやすく、暮らしに合わせた提案を行います。",
      tags: ["地域密着", "出張相談", "修理相談"],
      phone: "092-000-4444",
      email: "info@machi-electric.example",
      address: "福岡県糟屋郡新宮町夜臼5-5-5",
      hours: "9:00-18:00",
      closed: "日曜",
      website: "",
      instagram: "",
      parking: true,
      payment: ["現金", "カード"],
      image:
        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=900&q=80",
      examples: ["エアコン設置", "家電修理相談"]
    },
    {
      id: "shingu-print",
      name: "新宮デザイン印刷",
      category: "サービス",
      area: "緑ケ浜",
      plan: "基本情報",
      planRank: 4,
      detailPage: false,
      catchcopy: "チラシ、名刺、ポスター制作を相談できる印刷サービス",
      description:
        "地域事業者向けに、名刺、チラシ、ポスター、販促物のデザインと印刷を支援。少部数から相談できます。",
      tags: ["法人対応", "デザイン相談", "短納期相談"],
      phone: "092-000-5555",
      email: "info@shingu-print.example",
      address: "福岡県糟屋郡新宮町緑ケ浜6-6-6",
      hours: "9:00-18:00",
      closed: "土日祝",
      website: "https://example.com",
      instagram: "",
      parking: false,
      payment: ["振込", "カード"],
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      examples: ["名刺制作", "イベントチラシ", "店頭POP"]
    },
    ...memberCompanyPlaceholders
  ],
  features: [
    {
      category: "お店紹介",
      title: "休日の朝に立ち寄りたいパン屋",
      excerpt:
        "家族で過ごす朝、通勤前のひと息。町の暮らしに寄り添うベーカリーの楽しみ方を紹介します。",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80",
      date: "2026.07.08",
      tag: "グルメ"
    },
    {
      category: "暮らし",
      title: "住まいの小さな困りごと、どこに相談する？",
      excerpt:
        "水回り、外壁、店舗内装。町内の工務店に相談できることを、住民目線で分かりやすくまとめます。",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80",
      date: "2026.07.12",
      tag: "住まい"
    },
    {
      category: "商工会の活動",
      title: "商工会の役割を知る、地域と事業者を支える仕事",
      excerpt:
        "経営相談や地域イベント、青年部活動など、普段は見えにくい商工会の役割を紹介します。",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80",
      date: "2026.07.18",
      tag: "商工会"
    },
    {
      category: "まとめ",
      title: "子育て世代にうれしい、町内で頼れるお店とサービス",
      excerpt:
        "美容、健康、買い物、相談先。忙しい家庭が地域で頼れる場所をテーマ別にまとめます。",
      image:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=80",
      date: "2026.07.24",
      tag: "子育て"
    }
  ],
  latestArticles: [
    {
      category: "お知らせ",
      title: "夏休みに親子で立ち寄りたい、新宮町内のお店まとめ",
      date: "2026.07.26",
      author: "新宮町商工会",
      excerpt: "買い物、ランチ、体験、相談先まで。夏休みの暮らしに役立つ町内のお店を紹介します。",
      image:
        "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=1000&q=80"
    },
    {
      category: "商工会の活動",
      title: "青年部が取り組む、地域イベントを支える裏側",
      date: "2026.07.22",
      author: "青年部",
      excerpt: "地域行事の準備や運営を通して、町のにぎわいを支える青年部の活動を紹介します。",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80"
    },
    {
      category: "仕事の話",
      title: "地元のお店がSNSを始めるときに考えたいこと",
      date: "2026.07.18",
      author: "新宮町商工会",
      excerpt: "InstagramやLINEを活用し、地域のお客さんに情報を届けるための基本をまとめます。",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80"
    },
    {
      category: "暮らし",
      title: "急な住まいの困りごと、町内で相談できる先",
      date: "2026.07.14",
      author: "編集部",
      excerpt: "水回り、外壁、電気まわり。近くで相談できる事業者を知っておくと安心です。",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80"
    },
    {
      category: "お店紹介",
      title: "朝の時間を少し楽しくする、町のベーカリー",
      date: "2026.07.08",
      author: "編集部",
      excerpt: "通勤前や休日の朝に立ち寄れる、地域に根ざしたお店の魅力を紹介します。",
      image:
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1000&q=80"
    },
    {
      category: "相談窓口",
      title: "創業・経営相談会で聞けること",
      date: "2026.07.05",
      author: "新宮町商工会",
      excerpt: "創業準備、資金繰り、補助金、販路づくりなど、商工会の相談内容を分かりやすく紹介します。",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=80"
    }
  ],
  series: [
    {
      title: "新宮で働く人",
      subtitle: "経営者インタビュー",
      author: "編集部",
      image:
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80",
      items: ["毎朝のパンで、まちの一日を少し明るくしたい", "家の困りごとを、相談しやすい距離で受け止める"]
    },
    {
      title: "まちの便利帳",
      subtitle: "暮らしのまとめ",
      author: "新宮町商工会",
      image:
        "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=900&q=80",
      items: ["子育て世代にうれしい、町内で頼れるお店とサービス", "急な住まいの困りごと、町内で相談できる先"]
    },
    {
      title: "商工会の使い方",
      subtitle: "相談・支援情報",
      author: "新宮町商工会",
      image:
        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=80",
      items: ["創業・経営相談会で聞けること", "青年部が取り組む、地域イベントを支える裏側"]
    }
  ],
  interviews: [
    {
      businessId: "shingu-bakery",
      title: "毎朝のパンで、まちの一日を少し明るくしたい",
      person: "しんぐうベーカリー 店主",
      quote:
        "新宮で暮らす人が、今日も頑張ろうと思えるような朝の場所になれたらうれしいです。"
    },
    {
      businessId: "shingu-home-builder",
      title: "家の困りごとを、相談しやすい距離で受け止める",
      person: "新宮住まい工務店 代表",
      quote:
        "大きな工事だけではなく、小さな修繕から声をかけてもらえる関係を大切にしています。"
    },
    {
      businessId: "shingu-print",
      title: "お店の魅力を形にする仕事",
      person: "新宮デザイン印刷 ディレクター",
      quote:
        "名刺やチラシは、地域の仕事が次のお客さんと出会う最初のきっかけになります。"
    }
  ],
  adSlots: [
    {
      id: "top-pickup",
      label: "今月のおすすめ",
      publicLabel: "今月のおすすめ",
      businessId: "shingu-bakery",
      placement: "トップページのおすすめ",
      publicPlacement: "編集部ピックアップ",
      description: "最初に紹介したい、地域のお店・会社のおすすめ情報。",
      publicDescription: "朝の時間を少し楽しくしてくれる、地域に根ざしたベーカリーを紹介します。"
    },
    {
      id: "directory-pr",
      label: "おすすめ",
      publicLabel: "おすすめ",
      businessId: "shingu-home-builder",
      placement: "会員企業一覧のおすすめ",
      publicPlacement: "住まいの相談",
      description: "住まいや暮らしの相談先として知っておきたい事業者。",
      publicDescription: "家の小さな修繕から店舗内装まで、暮らしと仕事の相談先として紹介します。"
    },
    {
      id: "article-pr",
      label: "特集",
      publicLabel: "特集",
      businessId: "shingu-print",
      placement: "特集記事・インタビュー",
      publicPlacement: "仕事の裏側",
      description: "仕事の想いや商品・サービスの背景を紹介する記事。",
      publicDescription: "地元事業者の伝えたい想いを、デザインと印刷の仕事を通じて紹介します。"
    }
  ]
};
