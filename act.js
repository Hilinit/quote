let productlist = document.getElementById('product-list')
let prevBtn = document.getElementById('prevBtn')
let pageNumber = document.getElementById('pageNumber')
let nextBtn = document.getElementById('nextBtn')
let pages = 1;
const limit = 3
let allData = []

async function getData() {
    const res = await fetch('notes.json')
    allData = await res.json()
    renderData()
}

function renderData() {
    const start = (pages - 1) * limit;
    const end = start + limit;
    const items = allData.slice(start, end)
    productlist.innerHTML = items.map(item => `
        <div class="card bg-white p-4 sm:p-6 border border-slate-200 shadow-sm w-full max-w-xs rounded-lg mx-auto mt-6 overflow-hidden">
            <div class="flex flex-col items-center">
                <img src="${item.critic_image}" class="w-24 h-24 rounded-full" alt="profile image" />
                <div class="text-center mt-4">
                    <h3 class="text-slate-900 text-base font-semibold">${item.critic_name}</h3>
                    <span class="mt-1 block text-xs text-slate-500">${item.title} haqda fikirləri</span>
                    <span class="mt-1 block text-xs text-slate-900">${item.critic_quote}</span>
                </div>
            </div>
        </div>`).join('')

    pageNumber.innerHTML = `Səhifə: ${pages}`;
    prevBtn.disabled = pages === 1;
    nextBtn.disabled = end >= allData.length
}

nextBtn.onclick = () => { pages++; renderData() }
prevBtn.onclick = () => { pages--; renderData() }

getData()

// ---------------------------------------------------------------
let bookcards = document.getElementById('bookcards')
let bookData = []

async function getBooks() {
    const res = await fetch('quote_main_data.json')
    bookData = await res.json()
    renderBooks()
}

function renderBooks() {
    const items = bookData.slice(0, 40)
    bookcards.innerHTML = items.map(item => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden flex flex-col sm:flex-row border border-gray-100">
            <div class="sm:w-2/5 h-48 sm:h-auto overflow-hidden">
                <img src="${item.image_url}" alt="Imagination" class="w-full h-full">
            </div>
            <div class="p-6 mt-20">
                <h3 class="text-xl font-bold text-gray-800 leading-tight">${item.title} | ${item.author}</h3>
                <p class="text-xs font-semibold text-gray-400 mt-2 uppercase tracking-wider">JANR: ${item.genre} | Səhifə sayı: ${item.page_count}</p>
                <p class="text-gray-500 mt-4 text-sm leading-relaxed">${item.best_quote}</p>
                <h4 class="text-sm font-bold text-gray-800 leading-tight">Qiymət: ${item.price} ₼</h4>
                <button 
                onclick="addToBasket('${item.title}', ${item.price}, 0, '${item.image_url}', ${item.page_count}, '${item.genre}')"
                    class="px-5 py-2.5 mt-2 border border-[#dcdce4] bg-white rounded-lg font-semibold cursor-pointer transition duration-200 hover:bg-[#f0f0f5]">
                    Səbətə Əlavə Et
                </button>
            </div>
        </div>`).join('')
}

getBooks()

// ---------------------------------------------------------------
const modal = document.getElementById("modal")

function openClose() {
    modal.style.display === 'none' ? modal.style.display = 'block' : modal.style.display = 'none'
}

let basket = []
let promoApplied = false

function addToBasket(name, price, discount, image, page,genre) {
    const existing = basket.find(n => n.name === name)
    if (existing) {
        existing.count += 1
    } else {
        basket.push({ name, price, discount,count: 1, image,  page,genre })
    }
    updateUI()
}

function increaseCount(index) {
    basket[index].count += 1
    updateUI()
}

function decreaseCount(index) {
    if (basket[index].count > 1) {
        basket[index].count -= 1
    } else {
        basket.splice(index, 1)
    }
    updateUI()
}

function removeFromBasket(index) {
    basket.splice(index, 1)
    updateUI()
}

function applyPromo() {
    const input = document.getElementById('promo-input').value.trim()
    const msg = document.getElementById('promo-msg')
    const vali = Number(input)

    if (!input || isNaN(vali) || vali <= 0 || vali > 100) {
        promoApplied = false
        msg.innerText = 'X 1-100 arası rəqəm daxil et'
        msg.className = 'text-xs mt-2 text-red-500 font-medium'
    } else {
        promoApplied = vali
        msg.innerText = `✓ ${vali}% endirim tətbiq edildi!`
        msg.className = 'text-xs mt-2 text-emerald-600 font-medium'
    }

    calculateTotal()
}

function updateUI() {
    const sebet = document.getElementById('sebet')
    const countBadge = document.getElementById('proCount')

    sebet.innerHTML = ''
    countBadge.innerText = basket.length || '0'

    if (basket.length === 0) {
        sebet.innerHTML = '<p class="text-gray-400 italic py-4">Səbətiniz hal-hazırda boşdur.</p>'
        calculateTotal()
        return
    }
    basket.forEach((item, index) => {
        
        sebet.innerHTML += `<li class="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm"> 
    <div class="flex items-center gap-4">
        <img src="${item.image}" class="w-16 h-20 object-cover rounded-lg shrink-0" />
        <div class="flex-1">
            <div class="flex justify-between items-start">
                <div>
                    <p class="font-medium text-gray-800">${item.name}</p>
                    <p class="text-xs text-gray-400 mt-1">JANR: ${item.genre} | Səhifə: ${item.page}</p>
                    
                </div>
                <div class="flex flex-col items-end gap-2">
                    <span class="font-semibold text-slate-900">${((item.price - item.discount) * item.count).toFixed(2)} ₼</span>
                    <button onclick="removeFromBasket(${index})" class="text-gray-300 hover:text-red-500 transition cursor-pointer">
                        <i class="fa-regular fa-trash-can text-[15px]"></i>
                    </button>
                </div>
            </div>
            <div class="flex items-center border border-slate-300 rounded-lg overflow-hidden w-max mt-3">
                <button onclick="decreaseCount(${index})" class="px-3 py-1.5 hover:bg-gray-100 transition cursor-pointer text-sm">-</button>
                <span class="px-4 text-sm font-semibold">${item.count}</span>
                <button onclick="increaseCount(${index})" class="px-3 py-1.5 hover:bg-gray-100 transition cursor-pointer text-sm">+</button>
            </div>
        </div>
    </div></li>
`
    })

    calculateTotal()
}

function calculateTotal() {
    let totalRaw = 0
    let totalProductDiscount = 0

    basket.forEach(item => {
        totalRaw += item.price * item.count
        totalProductDiscount += item.discount * item.count
    })

    const afterProductDiscount = totalRaw - totalProductDiscount
    const promoPercent = promoApplied || 0
    const promoAmount = (afterProductDiscount * promoPercent) / 100
    const finalAmount = afterProductDiscount - promoAmount

    document.getElementById('subtotal').innerText = `${totalRaw.toFixed(2)} ₼ `
    document.getElementById('discount').innerText = `${(totalProductDiscount + promoAmount).toFixed(2)} ₼`
    document.getElementById('total').innerText =` ${(finalAmount < 0 ? 0 : finalAmount).toFixed(2) } ₼`
}

updateUI()