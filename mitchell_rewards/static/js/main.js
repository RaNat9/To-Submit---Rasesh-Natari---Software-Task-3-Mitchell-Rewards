// static/js/main.js
import Alpine from "https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js";
import "https://cdn.jsdelivr.net/npm/flowbite@2.x/dist/flowbite.js";
console.log("main.js loaded…");

Alpine.data("appMessage", () => ({
  show: false,
  message: "",
  type: "success",
  init() {
    this.$root.addEventListener("show-message", (evt) => {
      this.show = true;
      this.message = evt.detail.message;
      this.type = evt.detail.type;
      setTimeout(() => (this.show = false), 3000);
    });
  },
}));

Alpine.data("studentShop", () => ({
  items: [
    {
      id: 1,
      name: "Notebook",
      price: 50,
      stock: 100,
      category: "stationery",
      image: "https://placehold.co/600x400/FFD700/000000?text=Notebook",
    },
    {
      id: 2,
      name: "Pen Set",
      price: 75,
      stock: 50,
      category: "stationery",
      image: "https://placehold.co/600x400/ADD8E6/000000?text=Pen+Set",
    },
    {
      id: 3,
      name: "Voucher $10",
      price: 100,
      stock: 20,
      category: "vouchers",
      image: "https://placehold.co/600x400/90EE90/000000?text=Voucher+%2410",
    },
    {
      id: 4,
      name: "Headphones",
      price: 250,
      stock: 15,
      category: "electronics",
      image: "https://placehold.co/600x400/FFA07A/000000?text=Headphones",
    },
    {
      id: 5,
      name: "Water Bottle",
      price: 60,
      stock: 70,
      category: "accessories",
      image: "https://placehold.co/600x400/DDA0DD/000000?text=Water+Bottle",
    },
    {
      id: 6,
      name: "USB Drive 32GB",
      price: 90,
      stock: 40,
      category: "electronics",
      image: "https://placehold.co/600x400/87CEEB/000000?text=USB+Drive+32GB",
    },
    {
      id: 7,
      name: "Movie Ticket",
      price: 150,
      stock: 30,
      category: "experiences",
      image: "https://placehold.co/600x400/F08080/000000?text=Movie+Ticket",
    },
    {
      id: 8,
      name: "Backpack",
      price: 300,
      stock: 10,
      category: "accessories",
      image: "https://placehold.co/600x400/20B2AA/000000?text=Backpack",
    },
  ],
  showModal: false,
  currentBalance: 1234,
  selectedItem: null,
  purchaseCount: 1,
  calculatedCost: 0,

  init() {
    console.log("studentShop initialized");
    this.updateCost();
  },
  updateCost() {
    if (!this.selectedItem) return;
    this.calculatedCost = this.purchaseCount * this.selectedItem.price;
  },
  openPurchaseModal(item) {
    this.selectedItem = item;
    this.purchaseCount = 1;
    this.updateCost();
    this.showModal = true;
  },
  closeModal() {
    this.showModal = false;
  },
  confirmPurchase() {
    // …
    this.$dispatch("show-message", {
      message: `Purchased ${this.purchaseCount}×${this.selectedItem.name} for ${this.calculatedCost} pts`,
      type: "success",
    });
    this.currentBalance -= this.calculatedCost;
    document.getElementById("current_points").innerText = this.currentBalance;
    document.getElementById("nav_points_display").innerText =
      this.currentBalance;
    this.closeModal();
  },
}));

Alpine.data("teacherStudentSearch", () => ({
  allStudents: [
    /* … */
  ],
  filteredStudents: [],
  showModal: false,
  selectedStudent: null,
  awardReason: "",
  awardPoints: 0,

  init() {
    console.log("teacherStudentSearch initialized");
    this.filteredStudents = this.allStudents;
  },
  searchStudents() {
    // filter logic …
  },
  openAwardModal(student) {
    this.selectedStudent = student;
    this.awardReason = "";
    this.awardPoints = 0;
    this.showModal = true;
  },
  closeModal() {
    this.showModal = false;
  },
  confirmAward() {
    // …
    this.$dispatch("show-message", {
      /* … */
    });
    this.selectedStudent.points += this.awardPoints;
    this.closeModal();
  },
}));
// });

Alpine.start();
console.log("Alpine.js started");
