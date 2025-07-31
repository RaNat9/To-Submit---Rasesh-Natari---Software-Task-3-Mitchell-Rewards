// static/js/main.js
import Alpine from "https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js";
import "https://cdn.jsdelivr.net/npm/flowbite@2.x/dist/flowbite.js";
console.log("main.js loaded…");

// Explicitly expose Alpine to the global window object.
// This is crucial when importing Alpine as an ES module
// but needing it accessible by inline scripts or x-data directives
// that are not part of the module's direct scope.
window.Alpine = Alpine;

// Global User Role Management (for client-side navigation visibility)
// Define the store directly as a plain object for simplicity and clarity
Alpine.store("userRoles", {
  currentRole: "", // Will be set by individual page scripts
  init() {
    console.log(
      `User role store initialized. Current role: ${this.currentRole}`
    );
  },
});

// All other Alpine.data definitions remain the same
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
  all_items: [
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
  items: [], // This will hold the filtered/searched items
  searchQuery: "",
  filterCategory: "All Categories",

  showModal: false,
  currentBalance: 1234, // Mock student balance
  selectedItem: null,
  purchaseCount: 1,
  calculatedCost: 0,

  init() {
    console.log("studentShop initialized");
    this.items = this.all_items; // Initialize displayed items with all items
    this.updateCost();
    // Update nav points display and user name on init
    const navPointsDisplay = document.getElementById("nav_points_display");
    if (navPointsDisplay) {
      navPointsDisplay.innerText = this.currentBalance;
    }
    const navUserName = document.getElementById("nav_user_name");
    if (navUserName) {
      navUserName.innerText = "Student User"; // Placeholder
    }
    const navUserNameDropdown = document.getElementById(
      "nav_user_name_dropdown"
    );
    if (navUserNameDropdown) {
      navUserNameDropdown.innerText = "Student User"; // Placeholder
    }
  },
  applyFilters() {
    this.items = this.all_items.filter((item) => {
      const matchesSearch =
        this.searchQuery === "" ||
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory =
        this.filterCategory === "All Categories" ||
        item.category === this.filterCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
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
    if (this.calculatedCost > this.currentBalance) {
      this.$dispatch("show-message", {
        message: "Not enough points!",
        type: "error",
      });
      return;
    }
    if (this.purchaseCount > this.selectedItem.stock) {
      this.$dispatch("show-message", {
        message: "Not enough stock!",
        type: "error",
      });
      return;
    }
    this.$dispatch("show-message", {
      message: `Purchased ${this.purchaseCount}×${this.selectedItem.name} for ${this.calculatedCost} pts`,
      type: "success",
    });
    this.currentBalance -= this.calculatedCost;
    document.getElementById("current_points").innerText = this.currentBalance;
    const navPointsDisplay = document.getElementById("nav_points_display");
    if (navPointsDisplay) {
      navPointsDisplay.innerText = this.currentBalance;
    }
    this.closeModal();
  },
}));

Alpine.data("teacherStudentSearch", () => ({
  allStudents: [
    { id: 1, firstName: "Alice", lastName: "Smith", year: 2025, points: 500 },
    { id: 2, firstName: "Bob", lastName: "Johnson", year: 2024, points: 750 },
    { id: 3, firstName: "Charlie", lastName: "Brown", year: 2025, points: 300 },
    { id: 4, firstName: "Diana", lastName: "Miller", year: 2023, points: 1200 },
    { id: 5, firstName: "Eve", lastName: "Davis", year: 2024, points: 600 },
    { id: 6, firstName: "Frank", lastName: "Wilson", year: 2025, points: 450 },
  ],
  filteredStudents: [],
  searchFirstName: "",
  searchLastName: "",
  searchYear: null,
  showModal: false,
  selectedStudent: null,
  awardReason: "",
  awardPoints: 0,

  init() {
    console.log("teacherStudentSearch initialized");
    this.filteredStudents = this.allStudents; // Initially show all students
    // Update nav user name for teacher role
    const navUserName = document.getElementById("nav_user_name");
    if (navUserName) {
      navUserName.innerText = "Teacher User"; // Placeholder
    }
    const navUserNameDropdown = document.getElementById(
      "nav_user_name_dropdown"
    );
    if (navUserNameDropdown) {
      navUserNameDropdown.innerText = "Teacher User"; // Placeholder
    }
  },
  searchStudents() {
    this.filteredStudents = this.allStudents.filter((student) => {
      const matchesFirstName = this.searchFirstName
        ? student.firstName
            .toLowerCase()
            .includes(this.searchFirstName.toLowerCase())
        : true;
      const matchesLastName = this.searchLastName
        ? student.lastName
            .toLowerCase()
            .includes(this.searchLastName.toLowerCase())
        : true;
      const matchesYear = this.searchYear
        ? student.year === this.searchYear
        : true;
      return matchesFirstName && matchesLastName && matchesYear;
    });
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
    if (!this.selectedStudent || !this.awardReason || this.awardPoints <= 0) {
      this.$dispatch("show-message", {
        message: "Please provide a reason and valid points.",
        type: "error",
      });
      return;
    }
    this.$dispatch("show-message", {
      message: `Successfully awarded ${this.awardPoints} points to ${this.selectedStudent.firstName} ${this.selectedStudent.lastName}, from Year ${this.selectedStudent.year} for the reason: ${this.awardReason}`,
      type: "success",
    });
    // Find the student in allStudents and update their points
    const studentToUpdate = this.allStudents.find(
      (s) => s.id === this.selectedStudent.id
    );
    if (studentToUpdate) {
      studentToUpdate.points += this.awardPoints;
    }
    this.closeModal();
    // Re-filter to update the displayed list if needed
    this.searchStudents();
  },
}));

// New component for Student Purchases History
Alpine.data("studentPurchasesHistory", () => ({
  purchases: [
    { id: 1, item: "Notebook", points: 50, date: "2024-07-20" },
    { id: 2, item: "Movie Ticket", points: 150, date: "2024-07-15" },
    { id: 3, item: "Pen Set", points: 75, date: "2024-07-10" },
    { id: 4, item: "Voucher $10", points: 100, date: "2024-07-01" },
  ],
  get totalPurchasesPoints() {
    return this.purchases.reduce((sum, purchase) => sum + purchase.points, 0);
  },
  init() {
    console.log("studentPurchasesHistory initialized");
  },
}));

// New component for Student Awards History
Alpine.data("studentAwardsHistory", () => ({
  awardedPoints: [
    {
      id: 5,
      teacher: "Ms. Davis",
      points: 20,
      date: "2024-06-28",
      reason: "Excellent participation in class",
      category: "Academic",
    },
    {
      id: 6,
      teacher: "Mr. Smith",
      points: 50,
      date: "2024-06-25",
      reason: "Helping a classmate with homework",
      category: "Community",
    },
    {
      id: 7,
      teacher: "Ms. Chen",
      points: 10,
      date: "2024-06-20",
      reason: "Consistent effort",
      category: "Effort",
    },
  ],
  get totalAwardedPoints() {
    return this.awardedPoints.reduce((sum, award) => sum + award.points, 0);
  },
  init() {
    console.log("studentAwardsHistory initialized");
  },
}));

Alpine.data("teacherRewardsHistory", () => ({
  awardedRewards: [
    {
      id: 1,
      student: "Alice Smith",
      year: 2025,
      points: 50,
      reason: "Excellent participation",
      date: "2024-07-20",
    },
    {
      id: 2,
      student: "Bob Johnson",
      year: 2024,
      points: 100,
      reason: "Outstanding effort",
      date: "2024-07-18",
    },
    {
      id: 3,
      student: "Charlie Brown",
      year: 2025,
      points: 25,
      reason: "Helping a classmate",
      date: "2024-07-15",
    },
    {
      id: 4,
      student: "Diana Miller",
      year: 2023,
      points: 75,
      reason: "Consistent good behavior",
      date: "2024-07-12",
    },
    {
      id: 5,
      student: "Eve Davis",
      year: 2024,
      points: 30,
      reason: "Volunteering for school event",
      date: "2024-07-10",
    },
    {
      id: 6,
      student: "Frank Wilson",
      year: 2025,
      points: 60,
      reason: "Improved academic performance",
      date: "2024-07-05",
    },
  ],
  get totalAwardedPoints() {
    return this.awardedRewards.reduce((sum, award) => sum + award.points, 0);
  },
  init() {
    console.log("teacherRewardsHistory initialized");
  },
}));

Alpine.data("adminItemShop", () => ({
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
  ],
  showAddItemModal: false,
  newItem: { name: "", price: 0, stock: 0, category: "", image: "" },
  showEditItemModal: false,
  editingItem: null,
  showDeleteConfirmModal: false,
  itemToDelete: null,

  init() {
    console.log("adminItemShop initialized");
    // Update nav user name for admin role
    const navUserName = document.getElementById("nav_user_name");
    if (navUserName) {
      navUserName.innerText = "Admin User"; // Placeholder
    }
    const navUserNameDropdown = document.getElementById(
      "nav_user_name_dropdown"
    );
    if (navUserNameDropdown) {
      navUserNameDropdown.innerText = "Admin User"; // Placeholder
    }
  },
  openAddItemModal() {
    this.newItem = { name: "", price: 0, stock: 0, category: "", image: "" };
    this.showAddItemModal = true;
  },
  closeAddItemModal() {
    this.showAddItemModal = false;
  },
  addNewItem() {
    // Simulate adding item
    const newId =
      this.items.length > 0
        ? Math.max(...this.items.map((item) => item.id)) + 1
        : 1;
    this.items.push({ ...this.newItem, id: newId });
    this.$dispatch("show-message", {
      message: `Added ${this.newItem.name} to shop!`,
      type: "success",
    });
    this.closeAddItemModal();
  },
  openEditItemModal(item) {
    this.editingItem = { ...item }; // Create a copy to edit
    this.showEditItemModal = true;
  },
  closeEditItemModal() {
    this.showEditItemModal = false;
  },
  updateItem() {
    // Simulate updating item
    const index = this.items.findIndex(
      (item) => item.id === this.editingItem.id
    );
    if (index !== -1) {
      this.items[index] = { ...this.editingItem };
      this.$dispatch("show-message", {
        message: `Updated ${this.editingItem.name}!`,
        type: "success",
      });
    }
    this.closeEditItemModal();
  },
  openDeleteConfirmModal(itemId) {
    this.itemToDelete = itemId;
    this.showDeleteConfirmModal = true;
  },
  closeDeleteConfirmModal() {
    this.showDeleteConfirmModal = false;
    this.itemToDelete = null;
  },
  confirmDelete() {
    if (this.itemToDelete !== null) {
      this.items = this.items.filter((item) => item.id !== this.itemToDelete);
      this.$dispatch("show-message", {
        message: "Item deleted!",
        type: "success",
      });
    }
    this.closeDeleteConfirmModal();
  },
}));

Alpine.start();
console.log("Alpine.js started");
