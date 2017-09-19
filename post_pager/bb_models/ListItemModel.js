var ListItemModel = Backbone.Model.extend({

    getCreatedAt: function() {
      return this.get(ListItemModel.fields.CREATED_AT);
    },

    getCreatedBy: function() {
      return this.get(ListItemModel.fields.CREATED_BY);
    },

    getCreatedById: function() {
      return this.get(ListItemModel.fields.CREATED_BY_ID);
    },

    getCreatedByName: function() {
      return this.get(ListItemModel.fields.CREATED_BY_NAME);
    },

    getCustomerApproved: function() {
      return this.get(ListItemModel.fields.CUSTOMER_APPROVED);
    },

    getData: function() {
      return this.get(ListItemModel.fields.DATA);
    },

    getManagerApproved: function() {
      return this.get(ListItemModel.fields.MANAGER_APPROVED);
    },

    getMessage: function() {
      return this.get(ListItemModel.fields.MESSAGE);
    },

    getNetwork: function() {
      return this.get(ListItemModel.fields.NETWORK);
    },

    getNetworkName: function() {
      return this.get(ListItemModel.fields.NETWORK_NAME);
    },

    getNetworkThumb: function() {
      return this.get(ListItemModel.fields.NETWORK_THUMB);
    },

    getProjectId: function() {
      return this.get(ListItemModel.fields.PROJECT_ID);
    },

    getRejectionMessage: function() {
      return this.get(ListItemModel.fields.REJECTION_MESSAGE);
    },

    getRejectionMessageManager: function() {
      return this.get(ListItemModel.fields.REJECTION_MESSAGE_MANAGER);
    },

    getSchedule: function() {
      return this.get(ListItemModel.fields.SCHEDULE);
    },

    // helpers
    isApproved: function() {
      return this.getCustomerApproved() === "1" && this.getManagerApproved() === "1";
    },

    isPending: function() {
      return this.getCustomerApproved() === "0" || this.getManagerApproved() === "0";
    },

    isRejected: function() {
      return this.getCustomerApproved() === "-1" || this.getManagerApproved() === "-1";
    },

    getStatus: function() {
      var status = ListItemModel.statuses.UNKNOWN;

      if (this.isApproved()) {
        status = ListItemModel.statuses.APPOVED;
      }
      else if (this.isPending()) {
        status = ListItemModel.statuses.PENDING;
      }
      else if (this.isRejected()) {
        status = ListItemModel.statuses.REJECTED
      }

      return status;
    }

}, {
  fields: {
    CREATED_AT: "created_at",
    CREATED_BY: "created_by",
    CREATED_BY_ID: "created_by_id",
    CREATED_BY_NAME: "created_by_name",
    CUSTOMER_APPROVED: "customer_approved",
    DATA: "data",
    ID: "id",
    MANAGER_APPROVED: "manager_approved",
    MESSAGE: "message",
    NETWORK: "network",
    NETWORK_NAME: "network_name",
    NETWORK_THUMB: "network_thumb",
    PROJECT_ID: "project_id",
    REJECTION_MESSAGE: "rejection_message",
    REJECTION_MESSAGE_MANAGER: "rejection_message_manager",
    SCHEDULE: "schedule",
  },
    statuses: {
      APPOVED: "Approved",
      PENDING: "Pending",
      REJECTED: "Rejected",
      UNKNOWN: "Unknown"
    }
});
