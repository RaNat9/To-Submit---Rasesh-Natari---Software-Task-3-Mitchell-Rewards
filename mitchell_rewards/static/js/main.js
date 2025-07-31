document.addEventListener("alpine:init", () => {
  // A single, global Alpine store to manage all application state.
  // This is a much better practice than defining redundant x-data blocks on each page.
  Alpine.store("appStore", {
    // --- Static Data (from Flask) ---
    // These will be populated from Jinja2 at page load.
    items: [],
    filteredItems: [],
    userRoles: {},
    user: {},

    // --- UI State ---
    editingItem: null,
    itemToDelete: null,
    purchaseModal: {
      item: null,
      quantity: 1,
      totalCost: 0,
    },
    searchQuery: "",
    categoryFilter: "",
    categories: [],

    // --- Initialization ---
    init(initialData) {
      // Populate the store with data passed from Flask.
      this.items = initialData.items || [];
      this.userRoles = initialData.userRoles || {};
      this.user = initialData.user || {};

      // Initial setup for the student dashboard.
      this.filteredItems = this.items;
      this.categories = [...new Set(this.items.map((item) => item.category))];
    },

    // --- Admin Item Shop Logic ---
    openAddModal() {
      this.editingItem = {
        name: "",
        price: 0,
        stock: 0,
        category: "",
        image: "https://placehold.co/40x40/cccccc/000000?text=I",
      };
      // Flowbite's modal toggle will handle showing the modal.
    },
    openEditModal(item) {
      // Clone the item so changes don't affect the original object until saved.
      this.editingItem = { ...item };
    },
    saveItem() {
      if (this.editingItem.id) {
        // Find and update the item
        const index = this.items.findIndex((i) => i.id === this.editingItem.id);
        if (index !== -1) {
          this.items[index] = this.editingItem;
        }
      } else {
        // Add a new item
        this.editingItem.id = this.items.length + 1; // Simple ID generation
        this.items.push(this.editingItem);
      }
      this.closeModal();
    },
    closeModal() {
      this.editingItem = null;
      // The modal will be removed from the DOM by x-if.
    },
    openDeleteConfirmModal(item) {
      this.itemToDelete = item;
    },
    confirmDelete() {
      this.items = this.items.filter(
        (item) => item.id !== this.itemToDelete.id
      );
      this.closeDeleteConfirmModal();
    },
    closeDeleteConfirmModal() {
      this.itemToDelete = null;
    },

    // --- Student Dashboard Logic ---
    filterItems() {
      this.filteredItems = this.items.filter((item) => {
        const matchesSearch = item.name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());
        const matchesCategory =
          this.categoryFilter === "" || item.category === this.categoryFilter;
        return matchesSearch && matchesCategory;
      });
    },
    openPurchaseModal(item) {
      this.purchaseModal.item = item;
      this.purchaseModal.quantity = 1;
      this.updatePurchaseCost();
    },
    updatePurchaseCost() {
      if (this.purchaseModal.item) {
        this.purchaseModal.totalCost =
          this.purchaseModal.quantity * this.purchaseModal.item.price;
      }
    },
    confirmPurchase() {
      const item = this.purchaseModal.item;
      const quantity = this.purchaseModal.quantity;
      const totalCost = this.purchaseModal.totalCost;

      if (totalCost > this.user.points) {
        alert("Not enough points!");
        return;
      }
      if (quantity > item.stock) {
        alert("Not enough stock!");
        return;
      }

      // Update state
      this.user.points -= totalCost;
      item.stock -= quantity;
      alert(
        `Successfully purchased ${quantity} x ${item.name} for ${totalCost} points!`
      );

      // Re-render the UI by clearing the modal state
      this.purchaseModal.item = null;
    },
  });

  // We can now call this init function from our templates with Jinja2 data.
  // Example: <script>Alpine.store('appStore').init({{ {'items': items, 'userRoles': user_roles, 'user': user_data} | tojson }});</script>
});
