(function () {
  'use strict';

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function showToast(message) {
    var toast = document.getElementById('cart-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove('is-visible'); }, 2600);
  }

  /* ---------- Cart count ---------- */
  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = count;
    });
  }

  function refreshCart() {
    fetch('/cart.js')
      .then(function (r) { return r.json(); })
      .then(function (cart) { updateCartCount(cart.item_count); })
      .catch(function () {});
  }

  /* ---------- Money formatting (fallback) ---------- */
  function formatMoney(cents) {
    var amount = (cents / 100).toFixed(2).replace('.', ',');
    var format = window.shopMoneyFormat || '{{amount}} €';
    return format.replace(/\{\{\s*amount\s*\}\}/, amount);
  }

  /* ---------- Product form (variants + add to cart) ---------- */
  function initProductForms() {
    document.querySelectorAll('[data-product-form]').forEach(function (form) {
      var wrap = form.closest('[data-product-json]');
      var variants = [];
      try { variants = JSON.parse(wrap.getAttribute('data-product-json')); } catch (e) { variants = []; }

      var buybox = form.closest('.product-hero__buybox');
      var optionFieldsets = buybox ? buybox.querySelectorAll('[data-option-index]') : form.querySelectorAll('[data-option-index]');
      var variantIdInput = form.querySelector('[data-variant-id]');
      var addBtn = form.querySelector('[data-add-to-cart]');
      var addBtnText = form.querySelector('[data-add-to-cart-text]');
      var priceWrap = buybox ? buybox.querySelector('.price') : null;

      function selectedOptions() {
        var selected = [];
        optionFieldsets.forEach(function (fs) {
          var active = fs.querySelector('.option-pill.is-selected');
          selected.push(active ? active.getAttribute('data-option-value') : null);
        });
        return selected;
      }

      function findVariant() {
        var selected = selectedOptions();
        return variants.find(function (v) {
          var opts = [v.option1, v.option2, v.option3];
          return selected.every(function (val, i) { return val === null || opts[i] === val; });
        });
      }

      function applyVariant(variant) {
        if (!variant) return;
        variantIdInput.value = variant.id;
        if (priceWrap) {
          var currentEl = priceWrap.querySelector('.price__current');
          var compareEl = priceWrap.querySelector('.price__compare');
          if (currentEl) currentEl.textContent = formatMoney(variant.price);
          if (variant.compare_at_price && variant.compare_at_price > variant.price) {
            priceWrap.classList.add('price--sale');
            if (!compareEl) {
              compareEl = document.createElement('span');
              compareEl.className = 'price__compare';
              priceWrap.appendChild(compareEl);
            }
            compareEl.textContent = formatMoney(variant.compare_at_price);
          } else {
            priceWrap.classList.remove('price--sale');
            if (compareEl) compareEl.remove();
          }
        }
        if (variant.available) {
          addBtn.removeAttribute('disabled');
          if (addBtnText) addBtnText.textContent = 'Añadir al carrito';
        } else {
          addBtn.setAttribute('disabled', 'disabled');
          if (addBtnText) addBtnText.textContent = 'Agotado';
        }
      }

      optionFieldsets.forEach(function (fs) {
        fs.addEventListener('click', function (e) {
          var btn = e.target.closest('.option-pill');
          if (!btn) return;
          fs.querySelectorAll('.option-pill').forEach(function (p) { p.classList.remove('is-selected'); });
          btn.classList.add('is-selected');
          applyVariant(findVariant());
        });
      });

      /* Quantity stepper */
      var stepper = form.querySelector('[data-qty-stepper]');
      if (stepper) {
        var qtyInput = stepper.querySelector('[data-qty-input]');
        stepper.querySelector('[data-qty-increase]').addEventListener('click', function () {
          qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) + 1);
        });
        stepper.querySelector('[data-qty-decrease]').addEventListener('click', function () {
          qtyInput.value = Math.max(1, (parseInt(qtyInput.value, 10) || 1) - 1);
        });
      }

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (addBtn.hasAttribute('disabled')) return;
        var originalText = addBtnText ? addBtnText.textContent : '';
        if (addBtnText) addBtnText.textContent = 'Añadiendo…';
        fetch(((window.themeRoutes && window.themeRoutes.cartAdd) || '/cart/add') + '.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            id: variantIdInput.value,
            quantity: parseInt(form.querySelector('[name="quantity"]').value, 10) || 1
          })
        })
          .then(function (r) { if (!r.ok) throw new Error('add failed'); return r.json(); })
          .then(function () {
            showToast((window.themeStrings && window.themeStrings.addedToCart) || 'Añadido al carrito');
            refreshCart();
          })
          .catch(function () {
            showToast((window.themeStrings && window.themeStrings.cartError) || 'No se ha podido añadir el producto');
          })
          .finally(function () {
            if (addBtnText) addBtnText.textContent = originalText;
          });
      });
    });
  }

  /* ---------- Sticky mobile add-to-cart from the sticky bar ---------- */
  function initStickyBuy() {
    var bar = document.querySelector('[data-sticky-buy]');
    var heroBuybox = document.querySelector('.product-hero__buybox');
    if (!bar || !heroBuybox) return;

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            bar.removeAttribute('data-visible');
          } else if (entry.boundingClientRect.top < 0) {
            bar.setAttribute('data-visible', '');
          }
        });
      }, { threshold: 0 });
      io.observe(heroBuybox);
    }

    var stickyAdd = bar.querySelector('[data-sticky-add]');
    if (stickyAdd) {
      stickyAdd.addEventListener('click', function () {
        var mainForm = document.querySelector('[data-product-form]');
        if (mainForm) mainForm.requestSubmit ? mainForm.requestSubmit() : mainForm.dispatchEvent(new Event('submit', { cancelable: true }));
      });
    }
  }

  /* ---------- Gallery: thumbnails + hover zoom ---------- */
  function initGallery() {
    document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
      var frame = gallery.querySelector('[data-zoom-frame]');
      var images = gallery.querySelectorAll('.product-gallery__image');
      var thumbs = gallery.querySelectorAll('.product-gallery__thumb');

      thumbs.forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          var id = thumb.getAttribute('data-media-id');
          images.forEach(function (img) { img.classList.toggle('is-active', img.getAttribute('data-media-id') === id); });
          thumbs.forEach(function (t) { t.classList.toggle('is-active', t === thumb); });
        });
      });

      if (frame && window.matchMedia('(hover: hover)').matches) {
        frame.addEventListener('mousemove', function (e) {
          var rect = frame.getBoundingClientRect();
          var x = ((e.clientX - rect.left) / rect.width) * 100;
          var y = ((e.clientY - rect.top) / rect.height) * 100;
          var active = frame.querySelector('.product-gallery__image.is-active');
          if (active) active.style.transformOrigin = x + '% ' + y + '%';
          frame.setAttribute('data-zooming', '');
        });
        frame.addEventListener('mouseleave', function () {
          frame.removeAttribute('data-zooming');
        });
      }
    });
  }

  /* ---------- Bundle / quantity-break selector ---------- */
  function initBundles() {
    document.querySelectorAll('[data-bundle-list]').forEach(function (list) {
      var buybox = list.closest('.product-hero__buybox');
      var qtyInput = buybox ? buybox.querySelector('[data-qty-input]') : null;
      list.querySelectorAll('[data-bundle-option]').forEach(function (option) {
        option.addEventListener('click', function () {
          list.querySelectorAll('[data-bundle-option]').forEach(function (o) { o.classList.remove('is-selected'); });
          option.classList.add('is-selected');
          var radio = option.querySelector('[data-bundle-radio]');
          if (radio) radio.checked = true;
          if (qtyInput) qtyInput.value = option.getAttribute('data-quantity') || 1;
        });
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  function initAccordion() {
    document.querySelectorAll('[data-accordion]').forEach(function (accordion) {
      accordion.querySelectorAll('[data-accordion-trigger]').forEach(function (trigger) {
        trigger.addEventListener('click', function () {
          var item = trigger.closest('.faq__item');
          var isOpen = item.classList.contains('is-open');
          item.classList.toggle('is-open', !isOpen);
          trigger.setAttribute('aria-expanded', String(!isOpen));
        });
      });
    });
  }

  /* ---------- Cart page: quantity + remove ---------- */
  function initCartPage() {
    var form = document.querySelector('[data-cart-form]');
    if (!form) return;

    function changeLine(key, quantity) {
      fetch(((window.themeRoutes && window.themeRoutes.cartChange) || '/cart/change') + '.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: key, quantity: quantity })
      }).then(function () { window.location.reload(); });
    }

    form.querySelectorAll('[data-cart-line]').forEach(function (line) {
      var key = line.getAttribute('data-line-key');
      var input = line.querySelector('[data-qty-input]');
      var inc = line.querySelector('[data-qty-increase]');
      var dec = line.querySelector('[data-qty-decrease]');
      var remove = line.querySelector('[data-cart-remove]');

      if (inc) inc.addEventListener('click', function () { changeLine(key, (parseInt(input.value, 10) || 1) + 1); });
      if (dec) dec.addEventListener('click', function () { changeLine(key, Math.max(0, (parseInt(input.value, 10) || 1) - 1)); });
      if (remove) remove.addEventListener('click', function () { changeLine(key, 0); });
      if (input) input.addEventListener('change', function () { changeLine(key, Math.max(0, parseInt(input.value, 10) || 0)); });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initProductForms();
    initBundles();
    initStickyBuy();
    initGallery();
    initAccordion();
    initCartPage();
  });
})();
