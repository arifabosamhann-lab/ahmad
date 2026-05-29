
// متغير يخزن حجم الخط الحالي من التخزين المحلي او يبدأ من 16
let fontLevel = Number(localStorage.getItem('fontLevel')) || 16;
// تطبيق حجم الخط على الموقع كله
// نستخدم متغير CSS حتى يتغير حجم الخط بسهولة
document.documentElement.style.setProperty('--fontSize', fontLevel + 'px');
// اذا كان الوضع المحفوظ ليلي نضيف كلاس dark
if(localStorage.getItem('theme') === 'dark'){document.body.classList.add('dark');}
// تشغيل اللغة المحفوظة او العربية عند فتح الصفحة
setLang(localStorage.getItem('lang') || 'ar');
// تحديث رقم السلة عند فتح اي صفحة
updateCartCount();
// اذا كنا داخل صفحة السلة نعرض محتوى السلة
renderCart();

// دالة تشغيل صوت الضغط على الازرار
function playClick(){
  // نحضر عنصر الصوت من الصفحة
  const sound = document.getElementById('clickSound');
  // اذا الصوت موجود نشغله من البداية
  if(sound){sound.currentTime = 0; sound.play().catch(()=>{});}
}
// دالة تشغيل وايقاف موسيقى الصفحة الرئيسية
function toggleHeroMusic(){
  // نحضر عنصر الموسيقى
  const music = document.getElementById('heroMusic');
  // اذا لم يوجد العنصر نوقف الدالة
  if(!music) return;
  // اذا الموسيقى متوقفة نشغلها
  if(music.paused){music.play().catch(()=>{});}else{music.pause();}
}
// دالة تغيير الوضع الليلي والنهاري
function toggleTheme(){
  // نبدل كلاس dark على جسم الصفحة
  document.body.classList.toggle('dark');
  // نحفظ اختيار المستخدم حتى يبقى بعد تحديث الصفحة
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
}
// دالة تغيير اللغة
function setLang(lang){
  // نحفظ اللغة في التخزين المحلي
  localStorage.setItem('lang', lang);
  // نغير لغة الصفحة
  document.documentElement.lang = lang;
  // العربي يمين والانجليزي يسار
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  // نغير النصوص التي تحتوي data-ar و data-en
  document.querySelectorAll('[data-ar]').forEach(el=>{
    // نضع النص المناسب حسب اللغة المختارة
    el.textContent = el.dataset[lang];
  });
  // نغير النصوص داخل خانات الادخال
  document.querySelectorAll('[data-ph-ar]').forEach(el=>{
    // placeholder عربي او انجليزي
    el.placeholder = lang === 'ar' ? el.dataset.phAr : el.dataset.phEn;
  });
}
// دالة تكبير وتصغير الخط
function changeFont(step){
  // نزيد او ننقص حجم الخط مع حد ادنى وحد اعلى
  fontLevel = Math.min(24, Math.max(13, fontLevel + step));
  // نطبق الحجم على الصفحة
  document.documentElement.style.setProperty('--fontSize', fontLevel + 'px');
  // نحفظ الحجم
  localStorage.setItem('fontLevel', fontLevel);
}
// دالة فتح قائمة الموبايل
function toggleMenu(){
  // نحضر القائمة
  const nav = document.getElementById('mainNav');
  // نفتح او نغلق القائمة
  if(nav){nav.classList.toggle('open');}
}
// دالة البحث داخل البطاقات
function searchCards(){
  // نحضر مربع البحث
  const box = document.getElementById('searchBox');
  // اذا غير موجود نوقف الدالة
  if(!box) return;
  // نأخذ كلمة البحث
  const q = box.value.toLowerCase();
  // نبحث داخل كل بطاقة قابلة للبحث
  document.querySelectorAll('.searchable').forEach(card=>{
    // نحضر نص البطاقة
    const text = card.textContent.toLowerCase();
    // نخفي البطاقة اذا لا تحتوي كلمة البحث
    card.classList.toggle('hidden', q && !text.includes(q));
  });
}
// دالة قراءة السلة من التخزين المحلي
function getCart(){
  // نحول النص المخزن الى مصفوفة
  return JSON.parse(localStorage.getItem('cart') || '[]');
}
// دالة حفظ السلة في التخزين المحلي
function saveCart(cart){
  // نخزن المصفوفة كنص
  localStorage.setItem('cart', JSON.stringify(cart));
  // نحدث رقم السلة
  updateCartCount();
}
// دالة اضافة منتج للسلة
function addCart(name, price, image){
  // نحضر السلة الحالية
  const cart = getCart();
  // نبحث هل المنتج موجود سابقا
  const item = cart.find(p=>p.name === name);
  // اذا موجود نزيد الكمية
  if(item){item.qty += 1;}else{cart.push({name:name, price:Number(price), image:image, qty:1});}
  // نحفظ السلة بعد التعديل
  saveCart(cart);
  // نخبر المستخدم ان المنتج انضاف
  alert('تمت اضافة ' + name + ' الى السلة');
}
// دالة تحديث رقم السلة في الهيدر
function updateCartCount(){
  // نجمع الكميات داخل السلة
  const count = getCart().reduce((sum,item)=>sum + item.qty,0);
  // نحضر مكان الرقم
  const el = document.getElementById('cartCount');
  // اذا موجود نعرض الرقم
  if(el){el.textContent = count;}
}
// دالة عرض السلة في صفحة cart
function renderCart(){
  // نحضر مكان عرض السلة
  const list = document.getElementById('cartList');
  // اذا الصفحة ليست صفحة السلة نوقف الدالة
  if(!list) return;
  // نحضر السلة
  const cart = getCart();
  // اذا السلة فارغة نعرض رسالة
  if(cart.length === 0){list.innerHTML = '<p>السلة فارغة حاليا</p>'; document.getElementById('cartTotal').textContent='0 JOD'; return;}
  // نجهز المتغير الذي يحمل مجموع السعر
  let total = 0;
  // نعرض كل منتج داخل السلة
  list.innerHTML = cart.map((item,index)=>{
    // نحسب مجموع كل منتج
    total += item.price * item.qty;
    // نرجع كود HTML للمنتج
    return `<div class="cart-item"><img src="${item.image}" alt="${item.name}"><div><h3>${item.name}</h3><p>${item.price} JOD × ${item.qty}</p></div><div class="actions"><button onclick="changeQty(${index},1);playClick()">+</button><button onclick="changeQty(${index},-1);playClick()">-</button><button onclick="removeCart(${index});playClick()">حذف</button></div></div>`;
  }).join('');
  // نعرض المجموع النهائي
  document.getElementById('cartTotal').textContent = 'المجموع: ' + total + ' JOD';
}
// دالة تغيير كمية المنتج
function changeQty(index, step){
  // نحضر السلة
  const cart = getCart();
  // نغير الكمية
  cart[index].qty += step;
  // اذا وصلت صفر نحذف المنتج
  if(cart[index].qty <= 0){cart.splice(index,1);}
  // نحفظ ونعيد عرض السلة
  saveCart(cart); renderCart();
}
// دالة حذف منتج من السلة
function removeCart(index){
  // نحضر السلة
  const cart = getCart();
  // نحذف المنتج حسب رقمه
  cart.splice(index,1);
  // نحفظ ونعرض من جديد
  saveCart(cart); renderCart();
}
// دالة تفريغ السلة كاملة
function clearCart(){
  // نحذف السلة من التخزين
  localStorage.removeItem('cart');
  // نحدث الرقم
  updateCartCount();
  // نعرض السلة الفارغة
  renderCart();
}
// دالة ارسال نموذج الخدمات
function sendService(e){
  // منع تحديث الصفحة
  e.preventDefault();
  // تشغيل صوت الضغط
  playClick();
  // نحضر القيم المكتوبة
  const type = document.getElementById('serviceType').value;
  // نحضر الاسم
  const name = document.getElementById('serviceName').value;
  // نحضر الهاتف
  const phone = document.getElementById('servicePhone').value;
  // نحضر المشكلة
  const problem = document.getElementById('serviceProblem').value;
  // نعرض ملخص الطلب للطالب
  document.getElementById('serviceResult').innerHTML = `تم ارسال طلب ${type} بنجاح<br>الاسم: ${name}<br>الهاتف: ${phone}<br>المشكلة: ${problem}`;
  // نفرغ النموذج بعد الارسال
  e.target.reset();
}
// دالة ارسال نموذج التواصل
function sendMessage(e){
  // منع تحديث الصفحة
  e.preventDefault();
  // تشغيل صوت الضغط
  playClick();
  // اظهار رسالة نجاح
  document.getElementById('formMsg').textContent='تم ارسال رسالتك بنجاح';
}
