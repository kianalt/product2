class product {
  constructor(name, id, photo, price) {
    this.name = name;
    this.id = id;
    this.photo = photo;
    this.price = price;


  }
  render() {
    const container = builder.create("article").className("products");
    const imageContainer = builder
      .create("div")
      .className("image-container")
      .appendTo(container);

    builder
      .create("img")
      .className("product-img")
      .src(this.photo)
      .appendTo(imageContainer);

    builder
      .create("button")
      .className("bag-btn")
      .html(
        '<i class="fas fa-shopping-cart"> </i>Add to cart<i class="fas fa-shopping-cart"> </i>'
      )
      .onclick(() => {
        const index = cartManager.cartItemList.findIndex(x => x.id === this.id);
        if (index === -1) {
          var cartItem = new CartItem(
            this.id,
            this.price,
            this.name,
            this.photo);
          cartItem.amount++;
          cartItem.totalItemPrice = cartItem.amount * cartItem.price;
          // cartManager.cartItemsList.push(cartItem);
          cartManager.cartItemList.push(cartItem);
          cartManager.totalItem++;
          // document.querySelector(".cart-item").text = cartManager.totalItem;
          document.querySelector(".cart-items").innerHTML =
            cartManager.totalItem;
        } else {
          const index = cartManager.cartItemList.findIndex(x => x.id === this.id);
          let fp = cartManager.cartItemList[index];
          fp.amount++;
          fp.totalItemPrice = fp.amount * fp.price;
          CartManager.totalItem++;
          // document.querySelector(".cart-item").text = cartManager.totalItem;
          document.querySelector(".cart-items").innerHTML =
            cartManager.totalItem;
        }
        cartManager.render();
      })
      .appendTo(imageContainer);
    builder.create("h3").text(this.name).appendTo(container);
    const c = container.build();
    return c;
  }
}

let productsRepository = [];

function loadProducts() {
  const getJason = JSON.parse(getJson);
  const PRODUCTS = getJason.items.map((item) => {
    return new product(
      item.fields.title,
      item.sys.id,
      item.fields.image.fields.file.url,
      item.fields.price
    );
  });
  const productDiv = document.querySelector("#productcenter");
  PRODUCTS.forEach((item) => {
    productDiv.appendChild(item.render());
  });
  productsRepository = [...PRODUCTS];
}
loadProducts();

//cart
class CartItem {
  constructor(id, price, name, photo) {
    this.id = id;
    this.price = price;
    this.name = name;
    this.amount = 0;
    this.photo = photo;
    this.totalItemPrice = 0;

  }
  increase = () => {
    this.amount++;

  }
  decrease = () => {
    this.amount--;

  }

}

class CartManager {
  constructor() {

    this.cartItemList = [];
    this.totalItem = 0;
    this.totalPrice = 0;
    this.cartOverly = document.querySelector(".cart-overlay");
    this.cart = document.querySelector(".cart");

    document.
      querySelector(".cart-btn")
      .addEventListener("click", () => {
        this.cartOverly.classList.add("transparentBcg");
        this.cart.classList.add("showCart");
        cartManager.render();
      });
  }


  getTotalPrice() {
    return this.cartItemList.reduce((acc, item) => {
      return (item.price * item.amount) + acc;
    }
      , 0
    );
  }

  render() {
    this.cart.innerHTML = "";
    builder
      .create("i")
      .className("fas fa-window-close close-cart")
      .onclick(() => {
        this.cartOverly.classList.remove("transparentBcg");
        this.cart.classList.remove("showCart");
      })
      .appendTo(this.cart);
    builder.create("h2").text("Your cart").appendTo(this.cart);
    this.cartItemList.forEach((item) => {
      const containerCart = builder
        .create("section")
        .className("cart-item")
        .appendTo(this.cart);

      builder
        .create("img")
        .src(item.photo)
        .appendTo(containerCart);

      const nameDiv = builder.create("div").appendTo(containerCart);

      builder.create("h4").html(item.name).appendTo(nameDiv);

      builder
        .create("h5")
        .html(item.price)
        .appendTo(nameDiv);

      builder
        .create("div")
        .className("remove-item")
        .text("remove")
        .onclick(() => {
          let i = cartManager.cartItemList.findIndex(x => x.id === item.id);
          if (i !== -1) {
            cartManager.totalItem -= this.cartItemList[i].amount;
            this.cartItemList.splice(i, 1);
            document.querySelector(".cart-item").textContent =
              cartManager.totalItem;
            cartManager.render();
          }
        })
        .appendTo(nameDiv);
      const amountDiv = builder
        .create("div")
        .className("item-amount")
        .appendTo(containerCart);

      builder
        .create("i")
        .className("fas fa-chevron-up")
        .on("click", () => {
          item.amount++;

          item.totalItemPrice = item.amount * item.price;
          cartManager.totalItem++;
          document.getElementsByClassName("cart-items")[0].textContent =
            cartManager.totalItem;
          cartManager.render();
        })
        .appendTo(amountDiv);
      builder
        .create("div")
        .className("item-amount")
        .html(item.amount)
        .appendTo(amountDiv);

      const btndown = builder
        .create("i")
        .className("fas fa-chevron-down")
        .on("click", () => {
          item.amount--;

          item.totalItemPrice = item.amount * item.price;
          cartManager.totalItem--;
          document.getElementsByClassName("cart-items")[0].textContent =
            cartManager.totalItem;
          if (item.amount <= 0) {
            let i = cartManager.findIndex(x => x.id === item.id);
            this.cartItemList.splice(i, 1);
          }
          cartManager.render();
        })
        .appendTo(amountDiv);
    });
    const cartfooter = builder
      .create("div")
      .className("cart-footer")
      .appendTo(this.cart);
    builder
      .create("h3")
      .html(`<h3>your total:<span>${this.getTotalPrice()}</span></h3>`)
      .appendTo(cartfooter);

    builder
      .create("button")
      .className("clear-cart banner-btn")
      .text("Clear Cart")
      .onclick(() => {
        this.totalItem = 0;
        document.getElementsByClassName("cart-items")[0].textContent =
          cartManager.totalItem;
        cartManager.cartItemList = [];
        cartManager.render();
      })
      .appendTo(cartfooter);
  }
}


let cartManager = new CartManager();


