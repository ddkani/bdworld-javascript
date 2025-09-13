/*
 * 쇼핑카트 애플리케이션 (Shopping Cart Application)
 * Week 7-8 주제: 클래스, 복잡한 객체 관리, localStorage
 * Week 5-6 주제: 배열 메서드, 객체 조작, 함수 활용
 * Week 3-4 주제: DOM 조작, 이벤트 처리, 동적 HTML 생성
 * Week 1-2 주제: 조건문, 수학 연산, 변수 관리
 */

/*
 * 쇼핑카트 클래스 (Week 7-8: ES6 클래스와 복잡한 상태 관리)
 * 전자상거래 사이트의 핵심 기능인 상품 관리, 장바구니, 필터링, 결제 과정을 구현
 * 객체지향 프로그래밍 원칙을 활용한 체계적인 코드 구조
 */
class ShoppingCart {
    /*
     * 생성자: 상품 데이터와 초기 상태 설정 (Week 7-8: 생성자와 초기화)
     */
    constructor() {
        // 샘플 상품 데이터 - 실제 프로젝트에서는 API에서 가져옴 (Week 7-8: 복잡한 객체 배열)
        this.products = [
            { id: 1, name: "무선 헤드폰", price: 129.99, category: "electronics", stock: 15, image: "🎧", description: "노이즈 캔슬링 기능이 있는 고품질 무선 헤드폰" },
            { id: 2, name: "코튼 티셔츠", price: 24.99, category: "clothing", stock: 25, image: "👕", description: "다양한 색상으로 이용 가능한 편안한 100% 코튼 티셔츠" },
            { id: 3, name: "JavaScript 가이드", price: 39.99, category: "books", stock: 10, image: "📚", description: "현대 JavaScript 프로그래밍에 대한 완벽한 가이드" },
            { id: 4, name: "스마트 시계", price: 299.99, category: "electronics", stock: 8, image: "⌚", description: "건강 추적 기능이 있는 기능 풍부한 스마트시계" },
            { id: 5, name: "청바지", price: 79.99, category: "clothing", stock: 20, image: "👖", description: "프리미엄 소재로 만든 클래식 핏의 데님 청바지" },
            { id: 6, name: "원예용품 세트", price: 89.99, category: "home", stock: 12, image: "🛠️", description: "필수 원예 도구들의 완전한 세트" },
            { id: 7, name: "노트북", price: 899.99, category: "electronics", stock: 5, image: "💻", description: "업무와 엔터테인먼트를 위한 강력한 노트북" },
            { id: 8, name: "요리책", price: 29.99, category: "books", stock: 18, image: "📖", description: "세계 각국의 맛있는 레시피 모음" },
            { id: 9, name: "결울 재킷", price: 149.99, category: "clothing", stock: 3, image: "🧥", description: "추운 날씨를 위한 따뜻하고 세련된 결울 재킷" },
            { id: 10, name: "화분", price: 19.99, category: "home", stock: 30, image: "🪴", description: "실내 식물을 위한 아름다운 도자기 화분" },
            { id: 11, name: "블루투스 스피커", price: 79.99, category: "electronics", stock: 22, image: "🔊", description: "뛰어난 음질의 휴대용 블루투스 스피커" },
            { id: 12, name: "소설", price: 16.99, category: "books", stock: 35, image: "📘", description: "매혹적인 스토리라인의 베스트셀러 소설" }
        ];

        this.cart = this.loadCart();
        this.currentView = 'grid';
        this.currentCategory = 'all';
        this.currentPriceLimit = 1000;
        this.searchQuery = '';
        
        this.TAX_RATE = 0.085; // 8.5% 세율
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderProducts();
        this.updateCartUI();
        this.updateCartCount();
    }

    bindEvents() {
        // 카트 토글
        document.getElementById('cartToggle').addEventListener('click', () => this.toggleCart());
        document.getElementById('closeCart').addEventListener('click', () => this.closeCart());
        document.getElementById('cartOverlay').addEventListener('click', () => this.closeCart());
        
        // 카트 비우기
        document.getElementById('clearCart').addEventListener('click', () => this.clearCart());
        
        // 쇼핑 계속하기
        document.querySelector('.continue-shopping').addEventListener('click', () => this.closeCart());
        
        // 결제하기
        document.getElementById('checkout').addEventListener('click', () => this.showCheckout());
        
        // 모달 닫기
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });
        
        // 주문하기
        document.getElementById('placeOrder').addEventListener('click', () => this.placeOrder());
        
        // 뷰 토글
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeView(e.target.dataset.view));
        });
        
        // 필터
        document.querySelectorAll('input[name="category"]').forEach(input => {
            input.addEventListener('change', (e) => this.filterByCategory(e.target.value));
        });
        
        // 가격 범위
        document.getElementById('priceRange').addEventListener('input', (e) => {
            this.filterByPrice(e.target.value);
        });
        
        // 검색
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchProducts(e.target.value);
        });
        
        document.querySelector('.search-btn').addEventListener('click', () => {
            this.searchProducts(document.getElementById('searchInput').value);
        });

        // 동적으로 생성된 요소들을 위한 이벤트 위임
        document.getElementById('productsGrid').addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(e.target.dataset.productId);
                this.addToCart(productId);
            }
        });

        document.getElementById('cartItems').addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.productId);
            
            if (e.target.classList.contains('quantity-increase')) {
                this.updateQuantity(productId, 1);
            } else if (e.target.classList.contains('quantity-decrease')) {
                this.updateQuantity(productId, -1);
            } else if (e.target.classList.contains('remove-item')) {
                this.removeFromCart(productId);
            }
        });

        document.getElementById('cartItems').addEventListener('input', (e) => {
            if (e.target.classList.contains('quantity-input')) {
                const productId = parseInt(e.target.dataset.productId);
                const newQuantity = parseInt(e.target.value) || 1;
                this.setQuantity(productId, newQuantity);
            }
        });
    }

    // 상품 필터링 및 디스플레이
    getFilteredProducts() {
        return this.products.filter(product => {
            const categoryMatch = this.currentCategory === 'all' || product.category === this.currentCategory;
            const priceMatch = product.price <= this.currentPriceLimit;
            const searchMatch = this.searchQuery === '' || 
                product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(this.searchQuery.toLowerCase());
            
            return categoryMatch && priceMatch && searchMatch;
        });
    }

    renderProducts() {
        const grid = document.getElementById('productsGrid');
        const filteredProducts = this.getFilteredProducts();
        
        // 뷰 클래스 업데이트
        grid.className = `products-grid ${this.currentView === 'list' ? 'list-view' : ''}`;
        
        if (filteredProducts.length === 0) {
            grid.innerHTML = '<div class="no-products">조건에 맞는 상품을 찾을 수 없습니다.</div>';
            return;
        }
        
        grid.innerHTML = filteredProducts.map(product => this.createProductCard(product)).join('');
    }

    createProductCard(product) {
        const stockClass = product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : '';
        const stockText = product.stock === 0 ? '품절' : 
                         product.stock < 10 ? `단 ${product.stock}개 남음` : `${product.stock}개 재고`;
        
        return `
            <div class="product-card">
                <div class="product-image">${product.image}</div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-stock ${stockClass}">${stockText}</div>
                </div>
                <div class="product-actions">
                    <button class="add-to-cart" data-product-id="${product.id}" ${product.stock === 0 ? 'disabled' : ''}>
                        ${product.stock === 0 ? '품절' : '카트에 담기'}
                    </button>
                </div>
            </div>
        `;
    }

    // 필터링 메서드
    filterByCategory(category) {
        this.currentCategory = category;
        this.renderProducts();
    }

    filterByPrice(maxPrice) {
        this.currentPriceLimit = parseInt(maxPrice);
        document.getElementById('priceValue').textContent = maxPrice;
        this.renderProducts();
    }

    searchProducts(query) {
        this.searchQuery = query;
        this.renderProducts();
    }

    changeView(view) {
        this.currentView = view;
        
        // 버튼 상태 업데이트
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });
        
        this.renderProducts();
    }

    // 카트 관리
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product || product.stock === 0) return;

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity++;
            } else {
                this.showToast('더 많은 상품을 추가할 수 없습니다. 재고 한계에 도달했습니다.', 'error');
                return;
            }
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1,
                maxStock: product.stock
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.updateCartCount();
        this.showToast(`${product.name}이(가) 카트에 추가되었습니다!`);
    }

    updateQuantity(productId, change) {
        const cartItem = this.cart.find(item => item.id === productId);
        if (!cartItem) return;

        const newQuantity = cartItem.quantity + change;
        
        if (newQuantity <= 0) {
            this.removeFromCart(productId);
        } else if (newQuantity <= cartItem.maxStock) {
            cartItem.quantity = newQuantity;
            this.saveCart();
            this.updateCartUI();
            this.updateCartCount();
        } else {
            this.showToast('재고 한계에 도달했습니다!', 'error');
        }
    }

    setQuantity(productId, quantity) {
        const cartItem = this.cart.find(item => item.id === productId);
        if (!cartItem) return;

        if (quantity <= 0) {
            this.removeFromCart(productId);
        } else if (quantity <= cartItem.maxStock) {
            cartItem.quantity = quantity;
            this.saveCart();
            this.updateCartUI();
            this.updateCartCount();
        } else {
            // 사용자가 너무 높은 숫자를 입력하면 최대 재고로 리셋
            cartItem.quantity = cartItem.maxStock;
            this.saveCart();
            this.updateCartUI();
            this.updateCartCount();
            this.showToast('수량이 사용 가능한 재고로 조정되었습니다!', 'error');
        }
    }

    removeFromCart(productId) {
        const index = this.cart.findIndex(item => item.id === productId);
        if (index > -1) {
            const item = this.cart[index];
            this.cart.splice(index, 1);
            this.saveCart();
            this.updateCartUI();
            this.updateCartCount();
            this.showToast(`${item.name}이(가) 카트에서 제거되었습니다`);
        }
    }

    clearCart() {
        if (this.cart.length === 0) return;
        
        if (confirm('정말로 카트를 비우시겠습니까?')) {
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.updateCartCount();
            this.showToast('카트가 비워졌습니다');
        }
    }

    // 카트 UI 업데이트
    updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const cartEmpty = document.getElementById('cartEmpty');
        
        if (this.cart.length === 0) {
            cartItems.style.display = 'none';
            cartEmpty.style.display = 'block';
        } else {
            cartItems.style.display = 'block';
            cartEmpty.style.display = 'none';
            cartItems.innerHTML = this.cart.map(item => this.createCartItem(item)).join('');
        }
        
        this.updateCartSummary();
    }

    createCartItem(item) {
        return `
            <div class="cart-item">
                <div class="cart-item-image">${item.image}</div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn quantity-decrease" data-product-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" data-product-id="${item.id}" 
                               value="${item.quantity}" min="1" max="${item.maxStock}">
                        <button class="quantity-btn quantity-increase" data-product-id="${item.id}">+</button>
                    </div>
                    <button class="remove-item" data-product-id="${item.id}">Remove</button>
                </div>
            </div>
        `;
    }

    updateCartSummary() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * this.TAX_RATE;
        const total = subtotal + tax;
        
        document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
        document.getElementById('total').textContent = `$${total.toFixed(2)}`;
    }

    updateCartCount() {
        const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = count;
    }

    // 카트 가시성
    toggleCart() {
        const sidebar = document.getElementById('cartSidebar');
        const overlay = document.getElementById('cartOverlay');
        
        if (sidebar.classList.contains('open')) {
            this.closeCart();
        } else {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    closeCart() {
        document.getElementById('cartSidebar').classList.remove('open');
        document.getElementById('cartOverlay').classList.remove('active');
        document.body.style.overflow = '';
    }

    // 결제 기능
    showCheckout() {
        if (this.cart.length === 0) {
            this.showToast('카트가 비어있습니다!', 'error');
            return;
        }

        const modal = document.getElementById('checkoutModal');
        const orderSummary = document.getElementById('orderSummary');
        
        // 주문 요약 생성
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * this.TAX_RATE;
        const total = subtotal + tax;
        
        orderSummary.innerHTML = `
            <h3>주문 상품</h3>
            <div class="order-items">
                ${this.cart.map(item => `
                    <div class="order-item">
                        <span>${item.image} ${item.name}</span>
                        <span>$${item.price.toFixed(2)} × ${item.quantity} = $${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <div class="order-summary-total">
                <div>소계: $${subtotal.toFixed(2)}</div>
                <div>세금: $${tax.toFixed(2)}</div>
                <div><strong>총액: $${total.toFixed(2)}</strong></div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        document.getElementById('checkoutModal').classList.remove('active');
        document.body.style.overflow = '';
    }

    placeOrder() {
        const form = document.getElementById('checkoutForm');
        const inputs = form.querySelectorAll('input, textarea');
        
        // 간단한 검증
        let isValid = true;
        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.style.borderColor = '#dc2626';
                isValid = false;
            } else {
                input.style.borderColor = '';
            }
        });
        
        if (!isValid) {
            this.showToast('모든 필수 필드를 입력해 주세요', 'error');
            return;
        }
        
        // 주문 처리 시뮤레이션
        this.showToast('주문이 성공적으로 완료되었습니다! 구매해 주셔서 감사합니다.');
        
        // 카트 비우기 및 모달 닫기
        setTimeout(() => {
            this.cart = [];
            this.saveCart();
            this.updateCartUI();
            this.updateCartCount();
            this.closeModal();
            this.closeCart();
            
            // 폼 리셋
            form.reset();
        }, 1500);
    }

    // 로컬 저장소 관리
    saveCart() {
        try {
            localStorage.setItem('shoppingCart', JSON.stringify(this.cart));
        } catch (e) {
            console.error('localStorage에 카트 저장 실패:', e);
        }
    }

    loadCart() {
        try {
            const saved = localStorage.getItem('shoppingCart');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.error('localStorage에서 카트 로드 실패:', e);
            return [];
        }
    }

    // 유틸리티 메서드
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// 추가 유틸리티 함수
const CartUtils = {
    // 통화 형식 맞춤
    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },
    
    // 배송비 계산 (예시)
    calculateShipping(subtotal) {
        if (subtotal > 50) return 0; // $50 이상 무료 배송
        if (subtotal > 25) return 5.99; // $25-$50 주문 시 $5.99
        return 9.99; // $25 미만 주문 시 $9.99
    },
    
    // 주문 ID 생성
    generateOrderId() {
        return 'ORDER-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    },
    
    // 이메일 검증
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    // 전화번호 형식 맞춤
    formatPhoneNumber(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
        }
        return phone;
    }
};

// 쇼핑카트 애플리케이션 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.shoppingCart = new ShoppingCart();
});

// 선택사항: 키보드 단축키 추가
document.addEventListener('keydown', (e) => {
    // Escape로 카트나 모달 닫기
    if (e.key === 'Escape') {
        const cartSidebar = document.getElementById('cartSidebar');
        const modal = document.getElementById('checkoutModal');
        
        if (modal.classList.contains('active')) {
            window.shoppingCart.closeModal();
        } else if (cartSidebar.classList.contains('open')) {
            window.shoppingCart.closeCart();
        }
    }
    
    // Ctrl/Cmd + K로 검색에 포커스
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('searchInput').focus();
    }
});