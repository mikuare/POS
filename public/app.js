const state = {
  categories: [],
  products: [],
  cart: {},
  activeInvoice: null,
  lastPaidInvoice: null,
  scanQrContext: null,
  poller: null,
  activeCategory: 'main-dish',
  orderType: null,
  cashPromptActive: false,
  selectedDiscountProfileId: '',
  discountAmount: 0,
  productsRendered: false,
  authBusy: false,
  logoutBusy: false,
  startShiftBusy: false,
  appConfig: {
    enforceKitSpec: true
  },
  discountManagerProfiles: [],
  discountProfileEditorId: null,
  receiptTemplates: [],
  activeReceiptTemplate: null,
  receiptTemplateEditorId: null,
  connectivity: {
    mode: 'checking',
    queuedOperations: 0,
    queuedInvoices: 0,
    supabaseEnabled: true,
    supabaseReachable: false,
    serverReachable: false
  }
};

// -- POS Tab Elements --
const productsEl = document.getElementById('products');
const cartEl = document.getElementById('cart');
const addToCartConfettiEl = document.getElementById('addToCartConfetti');
const yummyOrderEmojiEl = document.getElementById('yummyOrderEmoji');
const subtotalValueEl = document.getElementById('subtotalValue');
const discountProfileSelectEl = document.getElementById('discountProfileSelect');
const discountPreviousTotalValueEl = document.getElementById('discountPreviousTotalValue');
const discountAppliedLabelEl = document.getElementById('discountAppliedLabel');
const discountDeductionValueEl = document.getElementById('discountDeductionValue');
const discountCurrentTotalValueEl = document.getElementById('discountCurrentTotalValue');
const totalDueValueEl = document.getElementById('totalDueValue');
const statusEl = document.getElementById('status');
const paymentMethodEl = document.getElementById('paymentMethod');
const amountTenderedEl = document.getElementById('amountTendered');
const cashPayBtn = document.getElementById('cashPayBtn');
const clearBtn = document.getElementById('clearBtn');
const dineInCheckoutBtn = document.getElementById('dineInCheckoutBtn');
const takeOutCheckoutBtn = document.getElementById('takeOutCheckoutBtn');
const cashPaymentBtn = document.getElementById('cashPaymentBtn');
const ePaymentBtn = document.getElementById('ePaymentBtn');
const cashRowEl = document.getElementById('cashRow');
const gcashInfoEl = document.getElementById('gcashInfo');
const statusReceiptActionsEl = document.getElementById('statusReceiptActions');
const statusPrintReceiptBtn = document.getElementById('statusPrintReceiptBtn');
const statusHoldForVoidBtn = document.getElementById('statusHoldForVoidBtn');
const salesSummaryEl = document.getElementById('salesSummary');
const salesListEl = document.getElementById('salesList');
const salesDetailedGridEl = document.getElementById('salesDetailedGrid');
const detailDailySalesEl = document.getElementById('detailDailySales');
const detailDailyMetaEl = document.getElementById('detailDailyMeta');
const detailMonthlySalesEl = document.getElementById('detailMonthlySales');
const detailMonthlyMetaEl = document.getElementById('detailMonthlyMeta');
const topProductsListEl = document.getElementById('topProductsList');
const salesDailyBtn = document.getElementById('salesDailyBtn');
const salesWeeklyBtn = document.getElementById('salesWeeklyBtn');
const salesRefreshBtn = document.getElementById('salesRefreshBtn');
const categoryTitleEl = document.getElementById('categoryTitle');
const paymentSuccessModalEl = document.getElementById('paymentSuccessModal');
const receiptLogoEl = document.getElementById('receiptLogo');
const receiptOrderSlipTitleEl = document.getElementById('receiptOrderSlipTitle');
const receiptStoreNameEl = document.getElementById('receiptStoreName');
const receiptStoreAddressEl = document.getElementById('receiptStoreAddress');
const receiptStoreTaxEl = document.getElementById('receiptStoreTax');
const receiptRefEl = document.getElementById('receiptRef');
const receiptDateEl = document.getElementById('receiptDate');
const receiptOrderTypeEl = document.getElementById('receiptOrderType');
const receiptPaymentMethodEl = document.getElementById('receiptPaymentMethod');
const receiptItemsEl = document.getElementById('receiptItems');
const receiptSubtotalEl = document.getElementById('receiptSubtotal');
const receiptDiscountEl = document.getElementById('receiptDiscount');
const receiptDiscountProfileRowEl = document.getElementById('receiptDiscountProfileRow');
const receiptDiscountProfileLabelEl = document.getElementById('receiptDiscountProfileLabel');
const receiptDiscountProfileValueEl = document.getElementById('receiptDiscountProfileValue');
const receiptTotalDueEl = document.getElementById('receiptTotalDue');
const receiptAmountPaidEl = document.getElementById('receiptAmountPaid');
const receiptChangeEl = document.getElementById('receiptChange');
const receiptFooterEl = document.getElementById('receiptFooter');
const receiptExtraNoteEl = document.getElementById('receiptExtraNote');
const receiptPrintBtn = document.getElementById('receiptPrintBtn');
const receiptHoldForVoidBtn = document.getElementById('receiptHoldForVoidBtn');
const receiptPrintAreaEl = document.getElementById('receiptPrintArea');
const paymentSuccessDoneBtn = document.getElementById('paymentSuccessDoneBtn');
const receiptMinimizeBtn = document.getElementById('receiptMinimizeBtn');
const adminReceiptModalEl = document.getElementById('adminReceiptModal');
const adminReceiptPrintAreaEl = document.getElementById('adminReceiptPrintArea');
const adminReceiptLogoEl = document.getElementById('adminReceiptLogo');
const adminReceiptOrderSlipTitleEl = document.getElementById('adminReceiptOrderSlipTitle');
const adminReceiptStoreNameEl = document.getElementById('adminReceiptStoreName');
const adminReceiptStoreAddressEl = document.getElementById('adminReceiptStoreAddress');
const adminReceiptStoreTaxEl = document.getElementById('adminReceiptStoreTax');
const adminReceiptRefEl = document.getElementById('adminReceiptRef');
const adminReceiptDateEl = document.getElementById('adminReceiptDate');
const adminReceiptOrderTypeEl = document.getElementById('adminReceiptOrderType');
const adminReceiptPaymentMethodEl = document.getElementById('adminReceiptPaymentMethod');
const adminReceiptItemsEl = document.getElementById('adminReceiptItems');
const adminReceiptSubtotalEl = document.getElementById('adminReceiptSubtotal');
const adminReceiptDiscountEl = document.getElementById('adminReceiptDiscount');
const adminReceiptDiscountProfileRowEl = document.getElementById('adminReceiptDiscountProfileRow');
const adminReceiptDiscountProfileLabelEl = document.getElementById('adminReceiptDiscountProfileLabel');
const adminReceiptDiscountProfileValueEl = document.getElementById('adminReceiptDiscountProfileValue');
const adminReceiptTotalDueEl = document.getElementById('adminReceiptTotalDue');
const adminReceiptAmountPaidEl = document.getElementById('adminReceiptAmountPaid');
const adminReceiptChangeEl = document.getElementById('adminReceiptChange');
const adminReceiptFooterEl = document.getElementById('adminReceiptFooter');
const adminReceiptExtraNoteEl = document.getElementById('adminReceiptExtraNote');
const adminReceiptPrintBtn = document.getElementById('adminReceiptPrintBtn');
const adminReceiptCloseBtn = document.getElementById('adminReceiptCloseBtn');
const eWalletModalEl = document.getElementById('eWalletModal');
const chooseGcashBtn = document.getElementById('chooseGcashBtn');
const choosePaymayaBtn = document.getElementById('choosePaymayaBtn');
const chooseScanQrBtn = document.getElementById('chooseScanQrBtn');
const cancelEwalletBtn = document.getElementById('cancelEwalletBtn');
const scanQrModalEl = document.getElementById('scanQrModal');
const scanQrContentEl = document.getElementById('scanQrContent');
const scanQrFinishBtn = document.getElementById('scanQrFinishBtn');
const scanQrCancelBtn = document.getElementById('scanQrCancelBtn');
const authGateEl = document.getElementById('authGate');
const loginFormEl = document.getElementById('loginForm');
const loginEmailEl = document.getElementById('loginEmail');
const loginPasswordEl = document.getElementById('loginPassword');
const authMessageEl = document.getElementById('authMessage');
const authLogoVideoEl = document.getElementById('authLogoVideo');
const authLogoCanvasEl = document.getElementById('authLogoCanvas');
const welcomeBannerEl = document.getElementById('welcomeBanner');
const cashOnHandBadgeEl = document.getElementById('cashOnHandBadge');
const settingsToggleBtn = document.getElementById('settingsToggleBtn');
const settingsMenuEl = document.getElementById('settingsMenu');
const settingsAdminDashboardBtn = document.getElementById('settingsAdminDashboardBtn');
const settingsEditMenuBtn = document.getElementById('settingsEditMenuBtn');
const settingsCashDrawerBtn = document.getElementById('settingsCashDrawerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const shiftMonitorToggleBtn = document.getElementById('shiftMonitorToggleBtn');
const shiftMonitorModalEl = document.getElementById('shiftMonitorModal');
const shiftMonitorCloseBtn = document.getElementById('shiftMonitorCloseBtn');
const shiftMonitorRefreshBtn = document.getElementById('shiftMonitorRefreshBtn');
const shiftMonitorSummaryEl = document.getElementById('shiftMonitorSummary');
const startShiftModalEl = document.getElementById('startShiftModal');
const startShiftDrawerSelectEl = document.getElementById('startShiftDrawerSelect');
const startShiftDrawerNameEl = document.getElementById('startShiftDrawerName');
const startShiftPreviousBalanceEl = document.getElementById('startShiftPreviousBalance');
const startShiftPreviousEndedAtEl = document.getElementById('startShiftPreviousEndedAt');
const startShiftReferenceStatusEl = document.getElementById('startShiftReferenceStatus');
const startShiftCashInputEl = document.getElementById('startShiftCashInput');
const startShiftAdjustmentInputEl = document.getElementById('startShiftAdjustmentInput');
const startShiftAdjustmentStatusEl = document.getElementById('startShiftAdjustmentStatus');
const startShiftUsePreviousBtn = document.getElementById('startShiftUsePreviousBtn');
const startShiftApplyAdjustmentBtn = document.getElementById('startShiftApplyAdjustmentBtn');
const startShiftConfirmBtn = document.getElementById('startShiftConfirmBtn');
const startShiftSignOutBtn = document.getElementById('startShiftSignOutBtn');
const cashoutSummaryModalEl = document.getElementById('cashoutSummaryModal');
const cashoutSummaryEl = document.getElementById('cashoutSummary');
const cashoutEndingCashInputEl = document.getElementById('cashoutEndingCashInput');
const cashoutDiscrepancyStatusEl = document.getElementById('cashoutDiscrepancyStatus');
const cashoutSaveReportBtn = document.getElementById('cashoutSaveReportBtn');
const cashoutPrintReportBtn = document.getElementById('cashoutPrintReportBtn');
const cashoutConfirmBtn = document.getElementById('cashoutConfirmBtn');
const cashoutCancelBtn = document.getElementById('cashoutCancelBtn');
const phDateTimeEl = document.getElementById('phDateTime');
const welcomeRoleIconEl = document.getElementById('welcomeRoleIcon');
const welcomeTextEl = document.getElementById('welcomeText');
const globalToastEl = document.getElementById('globalToast');
const globalToastTitleEl = document.getElementById('globalToastTitle');
const globalToastMessageEl = document.getElementById('globalToastMessage');
const offlineStatusBarEl = document.getElementById('offlineStatusBar');
const offlineStatusTextEl = document.getElementById('offlineStatusText');
const offlineQueueCountEl = document.getElementById('offlineQueueCount');
const offlineSyncBtn = document.getElementById('offlineSyncBtn');
const offlinePendingPanelEl = document.getElementById('offlinePendingPanel');
const offlinePendingListEl = document.getElementById('offlinePendingList');

// -- Customer Info Elements --
const customerNameEl = document.getElementById('customerName');
const customerEmailEl = document.getElementById('customerEmail');
const customerPhoneEl = document.getElementById('customerPhone');

// -- Admin Tab Elements --
const adminFilterEl = document.getElementById('adminFilter');
const adminRangeEl = document.getElementById('adminRange');
const adminMonthPickerEl = document.getElementById('adminMonthPicker');
const adminRefreshBtn = document.getElementById('adminRefreshBtn');
const adminVerifyAllBtn = document.getElementById('adminVerifyAllBtn');
const adminMixToggleBtn = document.getElementById('adminMixToggleBtn');
const adminMixSectionEl = document.getElementById('adminMixSection');
const adminMixPanelEl = document.getElementById('adminMixPanel');
const adminTransactionsGroupHeadEl = document.getElementById('adminTransactionsGroupHead');
const adminTransactionsRowEl = document.getElementById('adminTransactionsRow');
const adminTransactionsEl = document.getElementById('adminTransactions');
const adminStatsEl = document.getElementById('adminStats');
const statTotalEl = document.getElementById('statTotal');
const statPaidEl = document.getElementById('statPaid');
const statPendingEl = document.getElementById('statPending');
const statRevenueEl = document.getElementById('statRevenue');
const statCashEl = document.getElementById('statCash');
const statGcashEl = document.getElementById('statGcash');
const adminCloseBtn = document.getElementById('adminCloseBtn');
const adminNavEl = document.getElementById('adminNav');
const adminNavOverviewBtn = document.getElementById('adminNavOverviewBtn');
const adminNavInventoryBtn = document.getElementById('adminNavInventoryBtn');
const adminNavKitSpecBtn = document.getElementById('adminNavKitSpecBtn');
const adminNavUsersBtn = document.getElementById('adminNavUsersBtn');
const adminNavOperationsBtn = document.getElementById('adminNavOperationsBtn');
const adminNavReceiptTemplatesBtn = document.getElementById('adminNavReceiptTemplatesBtn');
const adminNavReportsBtn = document.getElementById('adminNavReportsBtn');
const adminNavOthersBtn = document.getElementById('adminNavOthersBtn');
const adminPanelOverviewEl = document.getElementById('adminPanelOverview');
const adminPanelInventoryEl = document.getElementById('adminPanelInventory');
const adminPanelKitSpecEl = document.getElementById('adminPanelKitSpec');
const adminPanelUsersEl = document.getElementById('adminPanelUsers');
const adminPanelOperationsEl = document.getElementById('adminPanelOperations');
const adminPanelReceiptTemplatesEl = document.getElementById('adminPanelReceiptTemplates');
const adminPanelReportsEl = document.getElementById('adminPanelReports');
const adminPanelOthersEl = document.getElementById('adminPanelOthers');
const adminNavContextMenuEl = document.getElementById('adminNavContextMenu');
const adminNavContextPrevBtn = document.getElementById('adminNavContextPrevBtn');
const adminNavContextNextBtn = document.getElementById('adminNavContextNextBtn');
const ADMIN_PANEL_ORDER = Object.freeze([
  'overview',
  'inventory',
  'kit-spec',
  'users',
  'operations',
  'receipt-templates',
  'reports',
  'others'
]);
const ADMIN_NAV_BUTTONS = {
  overview: adminNavOverviewBtn,
  inventory: adminNavInventoryBtn,
  'kit-spec': adminNavKitSpecBtn,
  users: adminNavUsersBtn,
  operations: adminNavOperationsBtn,
  'receipt-templates': adminNavReceiptTemplatesBtn,
  reports: adminNavReportsBtn,
  others: adminNavOthersBtn
};
const ADMIN_NAV_ENTRIES = ADMIN_PANEL_ORDER
  .map((panelName) => ({ panelName, button: ADMIN_NAV_BUTTONS[panelName] }))
  .filter((entry) => entry.button instanceof HTMLElement);
const adminUsersSummaryEl = document.getElementById('adminUsersSummary');
const adminUsersListEl = document.getElementById('adminUsersList');
const roleAccessListEl = document.getElementById('roleAccessList');
const adminCreateUserNoteEl = document.getElementById('adminCreateUserNote');
const adminCreateUserFormEl = document.getElementById('adminCreateUserForm');
const adminCreateUserNameEl = document.getElementById('adminCreateUserName');
const adminCreateUserEmailEl = document.getElementById('adminCreateUserEmail');
const adminCreateUserPasswordEl = document.getElementById('adminCreateUserPassword');
const adminCreateUserRoleEl = document.getElementById('adminCreateUserRole');
const adminCreateUserBtnEl = document.getElementById('adminCreateUserBtn');
const cashierMonitoringRefreshBtn = document.getElementById('cashierMonitoringRefreshBtn');
const cashierMonitoringListEl = document.getElementById('cashierMonitoringList');
const cashDrawerControlModalEl = document.getElementById('cashDrawerControlModal');
const cashDrawerControlCloseBtnEl = document.getElementById('cashDrawerControlCloseBtn');
const cashDrawerAdminNoteEl = document.getElementById('cashDrawerAdminNote');
const cashDrawerCreateFormEl = document.getElementById('cashDrawerCreateForm');
const cashDrawerNameInputEl = document.getElementById('cashDrawerNameInput');
const cashDrawerInitialBalanceInputEl = document.getElementById('cashDrawerInitialBalanceInput');
const cashDrawerCreateBtnEl = document.getElementById('cashDrawerCreateBtn');
const cashDrawerSummaryEl = document.getElementById('cashDrawerSummary');
const cashDrawerListEl = document.getElementById('cashDrawerList');
const cashDrawerMovementsListEl = document.getElementById('cashDrawerMovementsList');
const shiftManagementRefreshBtn = document.getElementById('shiftManagementRefreshBtn');
const shiftManagementSummaryEl = document.getElementById('shiftManagementSummary');
const shiftManagementListEl = document.getElementById('shiftManagementList');
const discrepancyRefreshBtn = document.getElementById('discrepancyRefreshBtn');
const discrepancySummaryEl = document.getElementById('discrepancySummary');
const discrepancyAlertsListEl = document.getElementById('discrepancyAlertsList');
const receiptTemplatesStatusEl = document.getElementById('receiptTemplatesStatus');
const receiptTemplateAdminNoteEl = document.getElementById('receiptTemplateAdminNote');
const receiptTemplateFormEl = document.getElementById('receiptTemplateForm');
const receiptTemplateNameInputEl = document.getElementById('receiptTemplateNameInput');
const receiptTemplateOrderSlipTitleInputEl = document.getElementById('receiptTemplateOrderSlipTitleInput');
const receiptTemplateStoreNameInputEl = document.getElementById('receiptTemplateStoreNameInput');
const receiptTemplateStoreAddressInputEl = document.getElementById('receiptTemplateStoreAddressInput');
const receiptTemplateTaxLineInputEl = document.getElementById('receiptTemplateTaxLineInput');
const receiptTemplateShowDiscountProfileInputEl = document.getElementById('receiptTemplateShowDiscountProfileInput');
const receiptTemplateDiscountProfileLabelInputEl = document.getElementById('receiptTemplateDiscountProfileLabelInput');
const receiptTemplateFooterMessageInputEl = document.getElementById('receiptTemplateFooterMessageInput');
const receiptTemplateExtraMessageInputEl = document.getElementById('receiptTemplateExtraMessageInput');
const receiptTemplateExtraMessageAlignSelectEl = document.getElementById('receiptTemplateExtraMessageAlignSelect');
const receiptTemplateExtraMessageStyleSelectEl = document.getElementById('receiptTemplateExtraMessageStyleSelect');
const receiptTemplateExtraMessageOffsetXInputEl = document.getElementById('receiptTemplateExtraMessageOffsetXInput');
const receiptTemplateExtraMessageOffsetYInputEl = document.getElementById('receiptTemplateExtraMessageOffsetYInput');
const receiptTemplateMetaOffsetXInputEl = document.getElementById('receiptTemplateMetaOffsetXInput');
const receiptTemplateMetaOffsetYInputEl = document.getElementById('receiptTemplateMetaOffsetYInput');
const receiptTemplateItemsOffsetXInputEl = document.getElementById('receiptTemplateItemsOffsetXInput');
const receiptTemplateItemsOffsetYInputEl = document.getElementById('receiptTemplateItemsOffsetYInput');
const receiptTemplateTotalsOffsetXInputEl = document.getElementById('receiptTemplateTotalsOffsetXInput');
const receiptTemplateTotalsOffsetYInputEl = document.getElementById('receiptTemplateTotalsOffsetYInput');
const receiptTemplateLogoUrlInputEl = document.getElementById('receiptTemplateLogoUrlInput');
const receiptTemplateLogoFileInputEl = document.getElementById('receiptTemplateLogoFileInput');
const receiptTemplateLogoStorageNoteEl = document.getElementById('receiptTemplateLogoStorageNote');
const receiptTemplateShowLogoInputEl = document.getElementById('receiptTemplateShowLogoInput');
const receiptTemplateFontFamilySelectEl = document.getElementById('receiptTemplateFontFamilySelect');
const receiptTemplateHeaderAlignSelectEl = document.getElementById('receiptTemplateHeaderAlignSelect');
const receiptTemplateHeaderOffsetXInputEl = document.getElementById('receiptTemplateHeaderOffsetXInput');
const receiptTemplateHeaderOffsetYInputEl = document.getElementById('receiptTemplateHeaderOffsetYInput');
const receiptTemplateHeaderTopPaddingInputEl = document.getElementById('receiptTemplateHeaderTopPaddingInput');
const receiptTemplateFooterAlignSelectEl = document.getElementById('receiptTemplateFooterAlignSelect');
const receiptTemplateFooterOffsetXInputEl = document.getElementById('receiptTemplateFooterOffsetXInput');
const receiptTemplateFooterOffsetYInputEl = document.getElementById('receiptTemplateFooterOffsetYInput');
const receiptTemplateFooterFontSizeInputEl = document.getElementById('receiptTemplateFooterFontSizeInput');
const receiptTemplateFooterTopSpacingInputEl = document.getElementById('receiptTemplateFooterTopSpacingInput');
const receiptTemplatePaperWidthInputEl = document.getElementById('receiptTemplatePaperWidthInput');
const receiptTemplatePaddingInputEl = document.getElementById('receiptTemplatePaddingInput');
const receiptTemplateBorderRadiusInputEl = document.getElementById('receiptTemplateBorderRadiusInput');
const receiptTemplateSectionGapInputEl = document.getElementById('receiptTemplateSectionGapInput');
const receiptTemplateBaseFontSizeInputEl = document.getElementById('receiptTemplateBaseFontSizeInput');
const receiptTemplateTitleFontSizeInputEl = document.getElementById('receiptTemplateTitleFontSizeInput');
const receiptTemplateMetaFontSizeInputEl = document.getElementById('receiptTemplateMetaFontSizeInput');
const receiptTemplateTotalFontSizeInputEl = document.getElementById('receiptTemplateTotalFontSizeInput');
const receiptTemplateLogoWidthInputEl = document.getElementById('receiptTemplateLogoWidthInput');
const receiptTemplateBorderStyleSelectEl = document.getElementById('receiptTemplateBorderStyleSelect');
const receiptTemplateDividerStyleSelectEl = document.getElementById('receiptTemplateDividerStyleSelect');
const receiptTemplateTextColorInputEl = document.getElementById('receiptTemplateTextColorInput');
const receiptTemplateAccentColorInputEl = document.getElementById('receiptTemplateAccentColorInput');
const receiptTemplateMutedColorInputEl = document.getElementById('receiptTemplateMutedColorInput');
const receiptTemplateBackgroundColorInputEl = document.getElementById('receiptTemplateBackgroundColorInput');
const receiptTemplateBorderColorInputEl = document.getElementById('receiptTemplateBorderColorInput');
const receiptTemplateSaveNewBtnEl = document.getElementById('receiptTemplateSaveNewBtn');
const receiptTemplateUpdateBtnEl = document.getElementById('receiptTemplateUpdateBtn');
const receiptTemplateLogoClearBtnEl = document.getElementById('receiptTemplateLogoClearBtn');
const receiptTemplateResetBtnEl = document.getElementById('receiptTemplateResetBtn');
const receiptTemplateActivateBtnEl = document.getElementById('receiptTemplateActivateBtn');
const receiptTemplatePreviewAreaEl = document.getElementById('receiptTemplatePreviewArea');
const receiptTemplateListEl = document.getElementById('receiptTemplateList');
const salesOpsRangeEl = document.getElementById('salesOpsRange');
const salesOpsMonthPickerEl = document.getElementById('salesOpsMonthPicker');
const salesOpsRefreshBtn = document.getElementById('salesOpsRefreshBtn');
const salesOpsSummaryEl = document.getElementById('salesOpsSummary');
const hourlySalesGraphEl = document.getElementById('hourlySalesGraph');
const monthlyClosingMonthInputEl = document.getElementById('monthlyClosingMonthInput');
const monthlyClosingRefreshBtnEl = document.getElementById('monthlyClosingRefreshBtn');
const monthlyExpenseFormEl = document.getElementById('monthlyExpenseForm');
const monthlyExpenseDateInputEl = document.getElementById('monthlyExpenseDateInput');
const monthlyExpenseCategoryInputEl = document.getElementById('monthlyExpenseCategoryInput');
const monthlyExpenseDescriptionInputEl = document.getElementById('monthlyExpenseDescriptionInput');
const monthlyExpenseAmountInputEl = document.getElementById('monthlyExpenseAmountInput');
const monthlyExpenseNoteInputEl = document.getElementById('monthlyExpenseNoteInput');
const monthlyExpenseSaveBtnEl = document.getElementById('monthlyExpenseSaveBtn');
const discountConfigAdminNoteEl = document.getElementById('discountConfigAdminNote');
const discountProfileFormEl = document.getElementById('discountProfileForm');
const discountProfileNameInputEl = document.getElementById('discountProfileNameInput');
const discountProfileTypeInputEl = document.getElementById('discountProfileTypeInput');
const discountProfilePercentInputEl = document.getElementById('discountProfilePercentInput');
const discountProfilesListEl = document.getElementById('discountProfilesList');
const discountProfileModalEl = document.getElementById('discountProfileModal');
const discountProfileModalCloseBtnEl = document.getElementById('discountProfileModalCloseBtn');
const discountProfileModalTitleEl = document.getElementById('discountProfileModalTitle');
const discountProfileModalNoteEl = document.getElementById('discountProfileModalNote');
const discountProfileModalFormEl = document.getElementById('discountProfileModalForm');
const discountProfileModalNameInputEl = document.getElementById('discountProfileModalNameInput');
const discountProfileModalTypeInputEl = document.getElementById('discountProfileModalTypeInput');
const discountProfileModalAmountLabelEl = document.getElementById('discountProfileModalAmountLabel');
const discountProfileModalAmountInputEl = document.getElementById('discountProfileModalAmountInput');
const discountProfileModalDeleteBtnEl = document.getElementById('discountProfileModalDeleteBtn');
const monthlyClosingAdminNoteEl = document.getElementById('monthlyClosingAdminNote');
const monthlyClosingSummaryEl = document.getElementById('monthlyClosingSummary');
const monthlyExpenseListEl = document.getElementById('monthlyExpenseList');
const reportDailySalesBtn = document.getElementById('reportDailySalesBtn');
const reportMonthlyClosingBtn = document.getElementById('reportMonthlyClosingBtn');
const reportShiftBtn = document.getElementById('reportShiftBtn');
const reportTransactionsBtn = document.getElementById('reportTransactionsBtn');
const reportProductsBtn = document.getElementById('reportProductsBtn');
const reportDiscrepancyBtn = document.getElementById('reportDiscrepancyBtn');
const reportDownloadBtn = document.getElementById('reportDownloadBtn');
const reportPrintBtn = document.getElementById('reportPrintBtn');
const reportsStatusEl = document.getElementById('reportsStatus');
const reportsPreviewEl = document.getElementById('reportsPreview');
const inventoryIngredientFormEl = document.getElementById('inventoryIngredientForm');
const ingredientNameInputEl = document.getElementById('ingredientNameInput');
const ingredientQtyInputEl = document.getElementById('ingredientQtyInput');
const ingredientPriceInputEl = document.getElementById('ingredientPriceInput');
const ingredientUnitInputEl = document.getElementById('ingredientUnitInput');
const ingredientUnitSuggestionsEl = document.getElementById('ingredientUnitSuggestions');
const ingredientAddBtn = document.getElementById('ingredientAddBtn');
const inventoryBulkToggleBtnEl = document.getElementById('inventoryBulkToggleBtn');
const inventoryAdminNoteEl = document.getElementById('inventoryAdminNote');
const inventorySummaryEl = document.getElementById('inventorySummary');
const inventoryBulkEditorEl = document.getElementById('inventoryBulkEditor');
const inventoryAlertsWrapEl = document.getElementById('inventoryAlertsWrap');
const inventoryTableWrapEl = document.getElementById('inventoryTableWrap');
const inventoryEditModalEl = document.getElementById('inventoryEditModal');
const inventoryEditCloseBtnEl = document.getElementById('inventoryEditCloseBtn');
const inventoryEditFormEl = document.getElementById('inventoryEditForm');
const inventoryEditAssignedNoteEl = document.getElementById('inventoryEditAssignedNote');
const inventoryEditNameInputEl = document.getElementById('inventoryEditNameInput');
const inventoryEditQtyInputEl = document.getElementById('inventoryEditQtyInput');
const inventoryEditPriceInputEl = document.getElementById('inventoryEditPriceInput');
const inventoryEditUnitInputEl = document.getElementById('inventoryEditUnitInput');
const inventoryEditStatusEl = document.getElementById('inventoryEditStatus');
const inventoryEditSaveBtnEl = document.getElementById('inventoryEditSaveBtn');
const inventoryDeleteModalEl = document.getElementById('inventoryDeleteModal');
const inventoryDeleteCloseBtnEl = document.getElementById('inventoryDeleteCloseBtn');
const inventoryDeleteMessageEl = document.getElementById('inventoryDeleteMessage');
const inventoryDeleteStatusEl = document.getElementById('inventoryDeleteStatus');
const inventoryDeleteConfirmBtnEl = document.getElementById('inventoryDeleteConfirmBtn');
const inventoryHistoryModalEl = document.getElementById('inventoryHistoryModal');
const inventoryHistoryCloseBtnEl = document.getElementById('inventoryHistoryCloseBtn');
const inventoryHistorySummaryEl = document.getElementById('inventoryHistorySummary');
const inventoryHistoryTableWrapEl = document.getElementById('inventoryHistoryTableWrap');
const kitSpecNoteEl = document.getElementById('kitSpecNote');
const kitSpecCategorySelectEl = document.getElementById('kitSpecCategorySelect');
const kitSpecProductSelectEl = document.getElementById('kitSpecProductSelect');
const kitSpecControlBarEl = document.getElementById('kitSpecControlBar');
const kitSpecAddRowBtnEl = document.getElementById('kitSpecAddRowBtn');
const kitSpecSaveBtnEl = document.getElementById('kitSpecSaveBtn');
const kitSpecEditorEl = document.getElementById('kitSpecEditor');
const kitSpecSummaryEl = document.getElementById('kitSpecSummary');
const kitSpecModuleEl = document.getElementById('kitSpecModule');
const kitSpecModeControlEl = document.getElementById('kitSpecModeControl');
const kitSpecModeLabelEl = document.getElementById('kitSpecModeLabel');
const kitSpecModeHintEl = document.getElementById('kitSpecModeHint');
const kitSpecModeToggleBtnEl = document.getElementById('kitSpecModeToggleBtn');
const categoryButtonsEl = document.getElementById('categoryButtons');
const menuEditorModalEl = document.getElementById('menuEditorModal');
const menuEditorCloseBtn = document.getElementById('menuEditorCloseBtn');
const menuCategoryFormEl = document.getElementById('menuCategoryForm');
const menuCategoryNameInputEl = document.getElementById('menuCategoryNameInput');
const menuCategoryImageFileInputEl = document.getElementById('menuCategoryImageFileInput');
const menuCategoryAddBtn = document.getElementById('menuCategoryAddBtn');
const menuProductFormEl = document.getElementById('menuProductForm');
const menuProductNameInputEl = document.getElementById('menuProductNameInput');
const menuProductPriceInputEl = document.getElementById('menuProductPriceInput');
const menuProductCategoryInputEl = document.getElementById('menuProductCategoryInput');
const menuProductImageFileInputEl = document.getElementById('menuProductImageFileInput');
const menuProductAddBtn = document.getElementById('menuProductAddBtn');
const menuCategoryEditorListEl = document.getElementById('menuCategoryEditorList');
const menuProductEditorListEl = document.getElementById('menuProductEditorList');

// -- Tab Elements --
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

let activeSalesRange = 'daily';
let activeSalesOpsRange = 'daily';
let isAdminMixPanelOpen = false;
const AUTH_SESSION_KEY = 'pos_active_user_v1';
const AUTH_TOKEN_KEY = 'pos_auth_token_v1';
const AUTH_OFFLINE_CACHE_KEY = 'pos_offline_auth_cache_v1';
const UI_STATE_KEY_PREFIX = 'pos_ui_state_v1_';
const CATALOG_CACHE_KEY_PREFIX = 'pos_catalog_cache_v1_';
const CATALOG_CACHE_GLOBAL_KEY = 'pos_catalog_cache_v1_global';
const OFFLINE_AUTH_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;
const OFFLINE_SYNC_INTERVAL_MS = 15000;
const offlineOutbox = window.POSOfflineOutbox || null;
let confettiAnimation = null;
let yummyOrderAnimation = null;
let appInitialized = false;
let authLogoRenderStarted = false;
let activeAuthSession = null;
let phClockInterval = null;
let toastTimer = null;
let connectivityPoller = null;
let syncTriggerBusy = false;
let menuEditorWarmReady = false;
let menuEditorWarmInFlight = false;
let cashierShiftState = null;
let latestShiftSummary = null;
let startShiftContext = null;
let latestAdminReport = null;
let latestInventoryReportData = null;
let activeInventoryView = 'ingredients';
let inventoryBulkEditorOpen = false;
let kitSpecIngredients = [];
let kitSpecRecipes = [];
let kitSpecDraftRows = [];
let kitSpecCoverageFilter = 'all-products';
let inventoryEditContext = null;
let inventoryDeleteContext = null;
let inventoryHistoryContext = null;
let latestSalesOpsDashboard = null;
let latestAdminOverview = null;
let salesOpsHourlyChart = null;
let salesOpsWeekdayChart = null;
let activeSalesOpsHourlyView = 'bar';
let activeSalesOpsWeekdayView = 'bar';
let activeSalesOpsSelection = null;
let activeAdminNavContextPanel = '';
const BOOTSTRAP_CATALOG_FALLBACK = {
  categories: [
    { key: 'main-dish', name: 'Main Dish', image: '/Menu/Main Dish.png', sortOrder: 10 },
    { key: 'rice', name: 'Rice', image: '/Menu/Rice.png', sortOrder: 20 },
    { key: 'burger', name: 'Burger', image: '/Menu/Burger.png', sortOrder: 30 },
    { key: 'drinks', name: 'Drinks', image: '/Menu/Drinks.png', sortOrder: 40 },
    { key: 'fries', name: 'Fries', image: '/Menu/Fries.png', sortOrder: 50 },
    { key: 'dessert', name: 'Dessert', image: '/Menu/Dessert.png', sortOrder: 60 },
    { key: 'sauces', name: 'Sauces', image: '/Menu/Sauce.png', sortOrder: 70 }
  ],
  products: [
    { id: 'p1', name: 'Succulent Roast Beef', price: 249, category: 'main-dish', image: '/Main Dish/Succulent Roast Beef Slides with rice and beef sauce.png' },
    { id: 'p2', name: 'Roasted Beef w Java Rice', price: 229, category: 'main-dish', image: '/Main Dish/roasted beef w java rice.png' },
    { id: 'p3', name: 'Party Tray', price: 799, category: 'main-dish', image: '/Main Dish/Party Tray.png' },
    { id: 'p4', name: 'Letchon Baka', price: 269, category: 'main-dish', image: '/Main Dish/Letchon Baka.png' },
    { id: 'p5', name: 'Crispy Letchon Kawali', price: 219, category: 'main-dish', image: '/Main Dish/Crispy Letchon Kawali.png' },
    { id: 'p6', name: 'Beef Steak with Hot Sauce', price: 239, category: 'main-dish', image: '/Main Dish/beef steak with hot sauce.png' },
    { id: 'p7', name: 'Beef Caldereta', price: 229, category: 'main-dish', image: '/Main Dish/Beef Caldereta.png' },
    { id: 'p20', name: 'Delicious Fried Rice', price: 79, category: 'rice', image: '/Rice/Delicious fried rice.png' },
    { id: 'p21', name: 'Unli Rice', price: 59, category: 'rice', image: '/Rice/Unli Rice.png' },
    { id: 'p22', name: 'Brown Rice Bowl', price: 69, category: 'rice', image: '/Rice/Steaming bowl of brown rice.png' },
    { id: 'p23', name: 'Fluffy Rice Bowl', price: 65, category: 'rice', image: '/Rice/Steaming bowl of fluffy rice.png' },
    { id: 'p30', name: 'Spicy Jalapeno Cheeseburger', price: 189, category: 'burger', image: '/Burger/Spicy jalapeño cheeseburger with fries.png' },
    { id: 'p31', name: 'Gourmet Cheese Burger', price: 179, category: 'burger', image: '/Burger/Gourmet cheese burger.png' },
    { id: 'p32', name: 'Crispy Chicken Sandwich', price: 169, category: 'burger', image: '/Burger/Crispy chicken sandwich with slaw Burger.png' },
    { id: 'p33', name: 'BBQ Bacon Cheeseburger', price: 199, category: 'burger', image: '/Burger/BBQ bacon cheeseburger.png' },
    { id: 'p40', name: 'Lemon-Lime Soda', price: 59, category: 'drinks', image: '/Drinks/Refreshing lemon-lime soda on wood.png' },
    { id: 'p41', name: 'Iced Tea Citrus Mint', price: 69, category: 'drinks', image: '/Drinks/Iced tea with citrus and mint.png' },
    { id: 'p42', name: 'Refreshing Soda Lemon', price: 55, category: 'drinks', image: '/Drinks/Refreshing soda with lemon wedges.png' },
    { id: 'p43', name: 'Coke Float', price: 79, category: 'drinks', image: '/Drinks/Coke Float.png' },
    { id: 'p44', name: 'Mango Juice', price: 85, category: 'drinks', image: '/Drinks/Refreshing mango juice with mint garnish.png' },
    { id: 'p45', name: 'Citrus Iced Drink', price: 75, category: 'drinks', image: '/Drinks/Citrus iced drinks with mint garnish.png' },
    { id: 'p46', name: 'Strawberry Lemonade', price: 89, category: 'drinks', image: '/Drinks/Refreshing strawberry lemonade.png' },
    { id: 'p50', name: 'Loaded Bacon Cheese Fries', price: 139, category: 'fries', image: '/Fries/Loaded bacon cheese fries close-up.png' },
    { id: 'p51', name: 'Crispy Fries', price: 99, category: 'fries', image: '/Fries/Crispy Fries with dipping sauce.png' },
    { id: 'p52', name: 'Cajun Seasoned Fries', price: 119, category: 'fries', image: '/Fries/Cajun seasoned fries.png' },
    { id: 'p60', name: 'Strawberry Cheesecake Slice', price: 109, category: 'dessert', image: '/Dessert/Delicious strawberry cheesecake slice.png' },
    { id: 'p61', name: 'Leche Flan Slice', price: 89, category: 'dessert', image: '/Dessert/Delicious slice of leche flan.png' },
    { id: 'p62', name: 'Chocolate Fudge Cake Slice', price: 119, category: 'dessert', image: '/Dessert/Delicious chocolate fudge cake slice.png' },
    { id: 'p70', name: 'Spicy Vinegar Sauce', price: 25, category: 'sauces', image: '/Sauces/Spicy Vinegar sauce.png' },
    { id: 'p71', name: 'Spicy BBQ Sauce', price: 30, category: 'sauces', image: '/Sauces/Spicy BBQ sauce.png' },
    { id: 'p72', name: 'Gravy Sauce', price: 25, category: 'sauces', image: '/Sauces/Gravy Sauce.png' },
    { id: 'p73', name: 'Baka Sauce', price: 35, category: 'sauces', image: '/Sauces/Baka Sauce.png' }
  ]
};
const GENERIC_CATEGORY_ICON = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect x="2" y="2" width="60" height="60" rx="12" fill="#f4ece3" stroke="#d8c1ae" stroke-width="2"/><circle cx="32" cy="32" r="13" fill="#fffaf5" stroke="#a7724e" stroke-width="2"/><rect x="30.8" y="16" width="2.4" height="10" rx="1.2" fill="#7a4a2d"/><rect x="30.8" y="38" width="2.4" height="10" rx="1.2" fill="#7a4a2d"/><rect x="16" y="30.8" width="10" height="2.4" rx="1.2" fill="#7a4a2d"/><rect x="38" y="30.8" width="10" height="2.4" rx="1.2" fill="#7a4a2d"/></svg>')}`;

// ------------------------------------------
// Utility Functions
// ------------------------------------------

function money(value) {
  return `PHP ${Number(value).toFixed(2)}`;
}

function formatCompactNumber(value) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(Number(value || 0));
}

function setActiveSalesOpsSelection(selection = null) {
  if (!selection || !Number.isInteger(selection.index) || selection.index < 0) {
    activeSalesOpsSelection = null;
    return;
  }
  activeSalesOpsSelection = {
    source: selection.source === 'weekday' ? 'weekday' : 'hourly',
    index: selection.index
  };
}

function getActiveSalesOpsSelectionSnapshot(result) {
  const selection = activeSalesOpsSelection;
  if (!selection || !result) return null;
  const rows = selection.source === 'weekday'
    ? (Array.isArray(result?.weekdaySales) ? result.weekdaySales : [])
    : (Array.isArray(result?.hourlySales) ? result.hourlySales : []);
  const row = rows[selection.index];
  if (!row) return null;
  return {
    source: selection.source,
    index: selection.index,
    row
  };
}

function renderSalesOpsSummaryCards(result) {
  if (!salesOpsSummaryEl) return;
  const totals = result?.totals || {};
  const rows = Array.isArray(result?.hourlySales) ? result.hourlySales : [];
  const weekdayRows = Array.isArray(result?.weekdaySales) ? result.weekdaySales : [];
  const peakHour = rows.reduce((best, row) => {
    return Number(row?.totalSales || 0) > Number(best?.totalSales || 0) ? row : best;
  }, null);
  const bestSalesDay = weekdayRows.reduce((best, row) => {
    return Number(row?.totalSales || 0) > Number(best?.totalSales || 0) ? row : best;
  }, null);
  const busiestDay = weekdayRows.reduce((best, row) => {
    return Number(row?.transactions || 0) > Number(best?.transactions || 0) ? row : best;
  }, null);
  const averagePerHour = rows.length
    ? rows.reduce((sum, row) => sum + Number(row.totalSales || 0), 0) / rows.length
    : 0;
  const selection = getActiveSalesOpsSelectionSnapshot(result);
  const selectedRow = selection?.row || null;
  const selectedDay = selection?.source === 'weekday' ? selectedRow : null;
  const selectedHour = selection?.source === 'hourly' ? selectedRow : null;
  const cards = [
    {
      highlight: true,
      label: 'Total Sales',
      value: money(selectedRow?.totalSales ?? totals.totalSales ?? 0),
      meta: `${Number(selectedRow?.transactions ?? totals.totalTransactions ?? 0)} transaction(s) in selected range`
    },
    {
      label: 'Best Sales Day',
      value: escapeHtml(selectedDay?.fullLabel || selectedDay?.label || bestSalesDay?.fullLabel || '—'),
      meta: `${money(selectedDay?.totalSales ?? bestSalesDay?.totalSales ?? 0)} in paid sales for the selected range`
    },
    {
      label: 'Peak Day',
      value: escapeHtml(selectedDay?.fullLabel || selectedDay?.label || busiestDay?.fullLabel || '—'),
      meta: `${Number(selectedDay?.transactions ?? busiestDay?.transactions ?? 0)} paid order(s) as customer traffic proxy`
    },
    {
      label: 'Peak Hour',
      value: escapeHtml(selectedHour?.label || peakHour?.label || '—'),
      meta: `${money(selectedHour?.totalSales ?? peakHour?.totalSales ?? 0)} | Avg per hour ${money(averagePerHour)}`
    },
    {
      label: 'Cash In Flow',
      value: money(selectedRow?.netCashRetained ?? totals.netCashRetained ?? 0),
      meta: `Tendered ${money(selectedRow?.cashTendered ?? totals.cashTendered ?? 0)} | Change ${money(selectedRow?.changeGiven ?? totals.changeGiven ?? 0)}`
    },
    {
      label: 'E Wallet',
      value: money(selectedRow?.digitalSales ?? totals.digitalSales ?? 0),
      meta: null
    }
  ];

  salesOpsSummaryEl.innerHTML = `
    <div class="sales-ops-summary-grid">
      ${cards.map((card) => `
        <article class="sales-ops-summary-card${card.highlight ? ' highlight' : ''}">
          <span>${card.label}</span>
          <strong>${card.value}</strong>
          ${card.meta ? `<small>${card.meta}</small>` : ''}
        </article>
      `).join('')}
    </div>
  `;
}

function destroySalesOpsWeekdayChart() {
  if (salesOpsWeekdayChart && typeof salesOpsWeekdayChart.destroy === 'function') {
    salesOpsWeekdayChart.destroy();
  }
  salesOpsWeekdayChart = null;
}

function destroySalesOpsHourlyChart() {
  if (salesOpsHourlyChart && typeof salesOpsHourlyChart.destroy === 'function') {
    salesOpsHourlyChart.destroy();
  }
  salesOpsHourlyChart = null;
}

const salesOpsWeekdayHoverLinePlugin = {
  id: 'salesOpsWeekdayHoverLine',
  afterDatasetsDraw(chart, _args, options) {
    const activeElements = chart?.tooltip?.getActiveElements?.() || [];
    if (!activeElements.length || !chart?.chartArea) return;
    const indexAxis = chart?.options?.indexAxis === 'y' ? 'y' : 'x';
    const x = activeElements[0]?.element?.x;
    const y = activeElements[0]?.element?.y;
    const { ctx, chartArea } = chart;
    ctx.save();
    ctx.beginPath();
    if (indexAxis === 'y') {
      if (!Number.isFinite(y)) {
        ctx.restore();
        return;
      }
      ctx.moveTo(chartArea.left, y);
      ctx.lineTo(chartArea.right, y);
    } else {
      if (!Number.isFinite(x)) {
        ctx.restore();
        return;
      }
      ctx.moveTo(x, chartArea.top);
      ctx.lineTo(x, chartArea.bottom);
    }
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = options?.color || '#ff4d4d';
    ctx.stroke();
    ctx.restore();
  }
};

function renderSalesOpsWeekdayTrendChart(weekdayRows = []) {
  const canvas = document.getElementById('salesOpsWeekdayChart');
  destroySalesOpsWeekdayChart();
  if (!canvas || !window.Chart || !weekdayRows.length) return;

  const isLineView = activeSalesOpsWeekdayView === 'line';
  const isBothView = activeSalesOpsWeekdayView === 'both';
  const isUnitView = activeSalesOpsWeekdayView === 'unit';
  const usesLineOnlyView = isLineView && !isBothView;
  const selectedWeekdayIndex = activeSalesOpsSelection?.source === 'weekday'
    ? activeSalesOpsSelection.index
    : -1;
  const datasets = [{
    type: isLineView ? 'line' : 'bar',
    label: isUnitView ? 'Orders' : 'Sales',
    data: weekdayRows.map((row) => isUnitView ? Number(row?.transactions || 0) : Number(row?.totalSales || 0)),
    backgroundColor(context) {
      if (context?.dataIndex === selectedWeekdayIndex) {
        if (usesLineOnlyView) return 'rgba(255, 113, 113, 0.24)';
        return isUnitView ? '#f4c95d' : '#ff8c66';
      }
      if (usesLineOnlyView) return 'rgba(79, 131, 204, 0.18)';
      if (isUnitView) {
        const chart = context.chart;
        const { chartArea } = chart || {};
        if (!chartArea) return '#dfa425';
        const gradient = chart.ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
        gradient.addColorStop(0, '#f7d778');
        gradient.addColorStop(1, '#d89918');
        return gradient;
      }
      const chart = context.chart;
      const { chartArea } = chart || {};
      if (!chartArea) return '#4f83cc';
      const gradient = chart.ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
      gradient.addColorStop(0, '#6fa8ff');
      gradient.addColorStop(1, '#3b78c8');
      return gradient;
    },
    borderColor(context) {
      if (context?.dataIndex === selectedWeekdayIndex) {
        return isUnitView ? '#b9810f' : '#d04b2f';
      }
      return isUnitView ? '#a87408' : '#2e66ae';
    },
    borderWidth: usesLineOnlyView ? 3 : 1,
    borderSkipped: false,
    borderRadius: usesLineOnlyView ? 0 : {
      topLeft: 10,
      topRight: 10,
      bottomLeft: 0,
      bottomRight: 0
    },
    hoverBackgroundColor: usesLineOnlyView
      ? 'rgba(79, 131, 204, 0.24)'
      : (isUnitView ? '#f4d98f' : '#7bb0ff'),
    hoverBorderColor: isUnitView ? '#8d650a' : '#255a9e',
    barPercentage: 0.62,
    categoryPercentage: 0.76,
    maxBarThickness: 54,
    tension: usesLineOnlyView ? 0.28 : 0,
    fill: usesLineOnlyView,
    pointRadius(context) {
      if (!usesLineOnlyView) return 0;
      return context?.dataIndex === selectedWeekdayIndex ? 7 : 5;
    },
    pointHoverRadius: usesLineOnlyView ? 7 : 0,
    pointBackgroundColor(context) {
      return context?.dataIndex === selectedWeekdayIndex ? '#ff8c66' : '#3d7bc6';
    },
    pointBorderColor: '#ffffff',
    pointBorderWidth: usesLineOnlyView ? 2 : 0,
    pointHitRadius: 18
  }];

  if (isBothView) {
    datasets.push({
      type: 'line',
      label: 'Sales Trend',
      data: weekdayRows.map((row) => Number(row?.totalSales || 0)),
      borderColor: '#2e66ae',
      backgroundColor: 'rgba(79, 131, 204, 0.14)',
      borderWidth: 3,
      tension: 0.28,
      fill: false,
      pointRadius(context) {
        return context?.dataIndex === selectedWeekdayIndex ? 7 : 5;
      },
      pointHoverRadius: 7,
      pointBackgroundColor(context) {
        return context?.dataIndex === selectedWeekdayIndex ? '#ff8c66' : '#3d7bc6';
      },
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointHitRadius: 18
    });
  }

  salesOpsWeekdayChart = new window.Chart(canvas.getContext('2d'), {
    type: isLineView ? 'line' : 'bar',
    data: {
      labels: weekdayRows.map((row) => [
        String(row?.label || '--'),
        `${Number(row?.transactions || 0)} order(s)`
      ]),
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      onClick(_event, elements) {
        if (!latestSalesOpsDashboard) return;
        if (!elements?.length) {
          setActiveSalesOpsSelection(null);
          renderSalesOpsDashboard(latestSalesOpsDashboard);
          return;
        }
        const nextIndex = Number(elements[0]?.index);
        if (!Number.isInteger(nextIndex) || nextIndex < 0) return;
        const isSameSelection = activeSalesOpsSelection?.source === 'weekday' && activeSalesOpsSelection?.index === nextIndex;
        setActiveSalesOpsSelection(isSameSelection ? null : { source: 'weekday', index: nextIndex });
        renderSalesOpsDashboard(latestSalesOpsDashboard);
      },
      animation: {
        duration: 280
      },
      layout: {
        padding: {
          top: 8,
          right: 10,
          bottom: 0,
          left: 4
        }
      },
      plugins: {
        legend: {
          display: isBothView,
          labels: {
            color: '#4a2d1d',
            font: {
              size: 11,
              weight: '700'
            },
            usePointStyle: true,
            boxWidth: 10,
            boxHeight: 10
          }
        },
        tooltip: {
          displayColors: isBothView,
          backgroundColor: 'rgba(42, 31, 24, 0.96)',
          titleColor: '#fffaf5',
          bodyColor: '#fffaf5',
          padding: 12,
          cornerRadius: 10,
          titleFont: {
            size: 12,
            weight: '700'
          },
          bodyFont: {
            size: 11,
            weight: '600'
          },
          callbacks: {
            title(items) {
              const row = weekdayRows[items?.[0]?.dataIndex] || {};
              return String(row?.fullLabel || row?.label || 'Weekday');
            },
            label(context) {
              const value = Number(context.parsed?.y || 0);
              if (isBothView) {
                return `${context.dataset?.label || 'Sales'}: ${money(value)}`;
              }
              return isUnitView ? `Orders: ${value}` : `Sales: ${money(value)}`;
            },
            afterLabel(context) {
              const row = weekdayRows[context?.dataIndex] || {};
              if (isUnitView) {
                return `Sales: ${money(row?.totalSales || 0)}`;
              }
              return `Orders: ${Number(row?.transactions || 0)}`;
            }
          }
        },
        salesOpsWeekdayHoverLine: {
          color: '#ff4d4d'
        }
      },
      scales: {
        x: {
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            autoSkip: false,
            color: '#4a2d1d',
            font: {
              size: 11,
              weight: '800'
            },
            padding: 12
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(88, 88, 88, 0.12)',
            drawBorder: false
          },
          ticks: {
            color: '#6d5a4d',
            font: {
              size: 11,
              weight: '700'
            },
            callback(value) {
              return formatCompactNumber(value);
            }
          }
        }
      }
    },
    plugins: [salesOpsWeekdayHoverLinePlugin]
  });
}

function getPaymentMethodLabel(method) {
  const map = {
    cash: 'Cash',
    gcash: 'GCash',
    paymaya: 'PayMaya'
  };
  return map[String(method || '').toLowerCase()] || String(method || '').toUpperCase();
}

function getPaymentMethodIcon(method) {
  const normalized = String(method || '').toLowerCase();
  if (normalized === 'cash') return '/Other/Cash.png';
  if (normalized === 'paymaya') return '/Other/Maya.png';
  return '/Other/GCash.png';
}

function setStatus(text) {
  statusEl.classList.remove('invoice-status');
  statusEl.textContent = text;
}

function isEwalletAvailable() {
  return state.connectivity.mode === 'online' || state.connectivity.mode === 'pending' || state.connectivity.mode === 'checking';
}

function updatePaymentActionAvailability() {
  const hasOrderType = Boolean(state.orderType);
  const ewalletAvailable = isEwalletAvailable();

  if (cashPaymentBtn) cashPaymentBtn.disabled = !hasOrderType;
  if (ePaymentBtn) ePaymentBtn.disabled = !hasOrderType || !ewalletAvailable;
  if (chooseGcashBtn) chooseGcashBtn.disabled = !ewalletAvailable;
  if (choosePaymayaBtn) choosePaymayaBtn.disabled = !ewalletAvailable;
  if (chooseScanQrBtn) chooseScanQrBtn.disabled = !ewalletAvailable;

  if (!ewalletAvailable && paymentMethodEl?.value !== 'cash') {
    closeEwalletModal();
    closeScanQrModal();
    state.cashPromptActive = false;
    setPaymentMethod('cash');
  }
}

function renderConnectivityStatus() {
  if (!offlineStatusBarEl || !offlineStatusTextEl || !offlineQueueCountEl) return;

  const mode = String(state.connectivity.mode || 'checking');
  const queuedOps = Math.max(0, Number(state.connectivity.queuedOperations || 0));
  const queuedInvoices = Math.max(0, Number(state.connectivity.queuedInvoices || 0));
  const modeClass = ['checking', 'offline', 'pending', 'online', 'server-offline'].includes(mode)
    ? mode
    : 'checking';

  offlineStatusBarEl.classList.remove('checking', 'offline', 'pending', 'online', 'server-offline');
  offlineStatusBarEl.classList.add(modeClass);

  let statusText = 'Checking cloud sync status...';
  if (mode === 'server-offline') {
    statusText = navigator.onLine
      ? 'Cannot reach POS cloud server right now. Keep this tab open and retry sync shortly.'
      : 'No internet connection. Sales are saved on this device and will sync when internet returns.';
  } else if (mode === 'offline') {
    statusText = 'Offline mode: sales continue locally and will sync when internet returns.';
  } else if (mode === 'pending') {
    statusText = 'Online: pending operations are waiting to sync.';
  } else if (mode === 'online') {
    statusText = 'Online and synced with cloud.';
  }

  offlineStatusTextEl.textContent = statusText;
  if (queuedInvoices > 0 && queuedOps > 0) {
    offlineQueueCountEl.textContent = `Pending sync: ${queuedInvoices} order(s) (${queuedOps} ops)`;
  } else {
    offlineQueueCountEl.textContent = `Pending sync: ${queuedOps} ops`;
  }

  if (offlineSyncBtn) {
    const canSync = queuedOps > 0
      && !syncTriggerBusy
      && state.connectivity.serverReachable
      && state.connectivity.supabaseEnabled
      && state.connectivity.supabaseReachable;
    offlineSyncBtn.disabled = !canSync;
    offlineSyncBtn.textContent = syncTriggerBusy ? 'Syncing...' : 'Sync now';
  }
}

function applyConnectivitySnapshot(snapshot, { showTransitionToast = true } = {}) {
  const previousMode = String(state.connectivity.mode || 'checking');
  const queuedOps = Math.max(0, Number(snapshot.queuedOperations || 0));
  const queuedInvoices = Math.max(0, Number(snapshot.queuedInvoices || 0));
  const browserOnline = navigator.onLine !== false;
  let mode = 'checking';

  if (!snapshot.serverReachable) {
    mode = 'server-offline';
  } else if (!snapshot.supabaseEnabled) {
    mode = queuedOps > 0 ? 'pending' : 'online';
  } else if (!browserOnline || !snapshot.supabaseReachable) {
    mode = 'offline';
  } else if (queuedOps > 0) {
    mode = 'pending';
  } else {
    mode = 'online';
  }

  state.connectivity = {
    mode,
    queuedOperations: queuedOps,
    queuedInvoices,
    supabaseEnabled: Boolean(snapshot.supabaseEnabled),
    supabaseReachable: Boolean(snapshot.supabaseReachable),
    serverReachable: Boolean(snapshot.serverReachable)
  };

  renderConnectivityStatus();
  updatePaymentActionAvailability();

  if (!showTransitionToast || previousMode === mode) return;

  if (mode === 'offline' || mode === 'server-offline') {
    showConfirmationToast({
      title: 'Offline mode',
      message: 'Sales are saved locally and will sync automatically.',
      tone: 'warning',
      duration: 3200
    });
    return;
  }

  if ((previousMode === 'offline' || previousMode === 'server-offline') && (mode === 'online' || mode === 'pending')) {
    showConfirmationToast({
      title: 'Internet restored',
      message: queuedOps > 0
        ? `${queuedOps} operation(s) waiting for sync.`
        : 'All sales are synced.',
      tone: 'success',
      duration: 2800
    });
  }
}

async function refreshConnectivityStatus({ showTransitionToast = true } = {}) {
  const clientSummary = await getClientOfflineSummary();
  try {
    const response = await fetch('/api/connectivity', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Connectivity check failed');
    }
    const payload = await response.json();
    applyConnectivitySnapshot({
      serverReachable: true,
      supabaseEnabled: Boolean(payload.supabaseEnabled),
      supabaseReachable: Boolean(payload.supabaseReachable),
      queuedOperations: clientSummary.operations,
      queuedInvoices: clientSummary.invoices
    }, { showTransitionToast });
    await renderOfflinePendingTransactions();
  } catch (_error) {
    applyConnectivitySnapshot({
      serverReachable: false,
      supabaseEnabled: state.connectivity.supabaseEnabled,
      supabaseReachable: false,
      queuedOperations: clientSummary.operations,
      queuedInvoices: clientSummary.invoices
    }, { showTransitionToast });
    await renderOfflinePendingTransactions();
  }
}

function startConnectivityMonitor() {
  if (connectivityPoller) return;
  refreshConnectivityStatus({ showTransitionToast: false }).catch(() => {});
  connectivityPoller = setInterval(() => {
    refreshConnectivityStatus({ showTransitionToast: true })
      .then(() => {
        if (navigator.onLine && state.connectivity.serverReachable) {
          return syncClientOfflineOutbox();
        }
        return null;
      })
      .then((result) => {
        if (result && result.synced > 0) {
          refreshConnectivityStatus({ showTransitionToast: false }).catch(() => {});
        }
      })
      .catch(() => {});
  }, OFFLINE_SYNC_INTERVAL_MS);
}

async function triggerOfflineSync() {
  if (syncTriggerBusy) return;
  syncTriggerBusy = true;
  renderConnectivityStatus();

  try {
    const clientResult = await syncClientOfflineOutbox();
    let serverSynced = 0;
    let serverFailed = 0;
    let serverRemaining = 0;

    if (state.connectivity.serverReachable && state.connectivity.supabaseEnabled) {
      try {
        const serverResult = await api('/api/sync/trigger', { method: 'POST' });
        serverSynced = Number(serverResult.synced || 0);
        serverFailed = Number(serverResult.failed || 0);
        serverRemaining = Number(serverResult.remaining || 0);
      } catch (_error) {
        // Client outbox sync already attempted; server queue sync is best-effort.
      }
    }

    const synced = Number(clientResult.synced || 0) + serverSynced;
    const failed = Number(clientResult.failed || 0) + serverFailed;
    const remaining = Number(clientResult.remaining || 0) + serverRemaining;

    showConfirmationToast({
      title: failed > 0 ? 'Sync completed with warnings' : 'Sync completed',
      message: `Synced: ${synced}, Failed: ${failed}, Remaining: ${remaining}`,
      tone: failed > 0 ? 'warning' : 'success',
      duration: 3200
    });

    await refreshConnectivityStatus({ showTransitionToast: false });
    await refreshSalesReport(activeSalesRange);
    if (document.body.classList.contains('admin-open')) {
      await refreshAdminTransactions();
    }
  } catch (error) {
    showConfirmationToast({
      title: 'Sync failed',
      message: error.message || 'Unable to sync pending operations.',
      tone: 'warning',
      duration: 3200
    });
    await refreshConnectivityStatus({ showTransitionToast: false });
  } finally {
    syncTriggerBusy = false;
    renderConnectivityStatus();
  }
}

function ensureConfettiAnimation() {
  if (confettiAnimation || !addToCartConfettiEl || !window.lottie) {
    return;
  }

  confettiAnimation = window.lottie.loadAnimation({
    container: addToCartConfettiEl,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: '/assets/confetti'
  });
}

function loadYummyEmoji(container) {
  if (!container || !window.lottie) return null;
  return window.lottie.loadAnimation({
    container,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: '/assets/yummy'
  });
}

function ensureYummyAnimations() {
  if (!yummyOrderAnimation) {
    yummyOrderAnimation = loadYummyEmoji(yummyOrderEmojiEl);
  }
}

function playAddToCartConfetti() {
  ensureConfettiAnimation();
  if (!confettiAnimation) return;
  confettiAnimation.stop();
  confettiAnimation.goToAndPlay(0, true);
}

function setOrderType(type) {
  state.orderType = type;
  state.cashPromptActive = false;
  updatePaymentActionAvailability();
  if (amountTenderedEl) amountTenderedEl.value = '';
  setPaymentMethod('cash');
  if (isEwalletAvailable()) {
    setStatus(`${getOrderTypeLabel(type)} selected. Choose Cash or E-Payment.`);
  } else {
    setStatus(`${getOrderTypeLabel(type)} selected. Offline mode active: Cash only until internet is back.`);
  }
}

function getOrderTypeLabel(type) {
  return type === 'take-out' ? 'Take Out' : 'Dine In';
}

function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getCurrentMonthValue() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthlyClosingSelectedMonth() {
  return String(monthlyClosingMonthInputEl?.value || getCurrentMonthValue()).trim();
}

function formatMonthLabel(monthValue) {
  const [year, month] = String(monthValue || '').split('-').map((part) => Number(part));
  if (!Number.isFinite(year) || !Number.isFinite(month)) return monthValue || 'Selected Month';
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long'
  });
}

function toClientProduct(product) {
  const availabilityStatus = String(product?.availabilityStatus || 'available').trim().toLowerCase() || 'available';
  const isAvailable = product?.isAvailable !== undefined ? Boolean(product.isAvailable) : availabilityStatus === 'available';
  return {
    id: product?.id,
    name: product?.name,
    price: Number(product?.price || 0),
    category: String(product?.category || '').trim().toLowerCase(),
    image: product?.image || '/Business Logo/Ruels Logo for business.png',
    hasKitSpec: product?.hasKitSpec !== undefined ? Boolean(product.hasKitSpec) : true,
    isAvailable,
    availabilityStatus,
    availabilityLabel: String(product?.availabilityLabel || (isAvailable ? 'Available' : 'Unavailable')).trim(),
    availabilityReason: String(product?.availabilityReason || '').trim(),
    availableUnits: Number(product?.availableUnits || 0)
  };
}

function getProductAvailabilityClass(product) {
  const status = String(product?.availabilityStatus || 'available').trim().toLowerCase();
  if (status === 'no-kit-spec') return 'needs-kit-spec';
  if (status === 'kit-spec-issue') return 'kit-spec-issue';
  if (status === 'out-of-stock') return 'out-of-stock';
  return 'available';
}

function getProductDisabledButtonLabel(product) {
  const status = String(product?.availabilityStatus || '').trim().toLowerCase();
  if (status === 'no-kit-spec') return 'Kit Spec Required';
  if (status === 'kit-spec-issue') return 'Review Kit Spec';
  if (status === 'out-of-stock') return 'Out of Stock';
  return 'Unavailable';
}

function getCartItems() {
  return Object.entries(state.cart)
    .filter(([, qty]) => qty > 0)
    .map(([productId, qty]) => ({ productId, qty }));
}

function getCartTotal() {
  const byId = Object.fromEntries(state.products.map((p) => [p.id, p]));
  return Object.entries(state.cart).reduce((sum, [productId, qty]) => {
    const p = byId[productId];
    return sum + (p ? p.price * qty : 0);
  }, 0);
}

function getDiscountAmount() {
  const subtotal = getCartTotal();
  const profile = getSelectedDiscountProfile();
  const amount = Number(profile?.amount || 0);
  if (!Number.isFinite(amount) || amount <= 0 || subtotal <= 0) return 0;
  if (String(profile?.type || '').trim().toLowerCase() === 'fixed') {
    return Math.min(subtotal, amount);
  }
  return Math.min(subtotal, subtotal * (amount / 100));
}

function getTotalDue() {
  const subtotal = getCartTotal();
  return Math.max(0, subtotal - getDiscountAmount());
}

async function api(path, options = {}) {
  const mergedHeaders = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };
  const res = await fetch(path, {
    ...options,
    headers: mergedHeaders
  });
  const rawText = await res.text();
  let data = {};
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch (_error) {
    data = {};
  }
  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

function isNetworkLikeError(error) {
  const txt = String(error?.message || '').toLowerCase();
  return txt.includes('fetch') || txt.includes('network') || txt.includes('offline') || txt.includes('failed to fetch');
}

const CLIENT_ORDER_SLIP_SEQUENCE_KEY = 'pos_client_order_slip_sequence_v1';
const CLIENT_ORDER_SLIP_DIGITS = 13;

function formatClientOrderSlipReference(sequence) {
  const safeSequence = Math.max(1, Math.floor(Number(sequence) || 1));
  return `OR-${String(safeSequence).padStart(CLIENT_ORDER_SLIP_DIGITS, '0')}`;
}

function createClientInvoiceReference(_invoiceId) {
  let nextSequence = 1;
  try {
    const previous = Number(localStorage.getItem(CLIENT_ORDER_SLIP_SEQUENCE_KEY) || 0);
    nextSequence = Number.isFinite(previous) && previous > 0
      ? Math.floor(previous) + 1
      : 1;
    localStorage.setItem(CLIENT_ORDER_SLIP_SEQUENCE_KEY, String(nextSequence));
  } catch (_error) {
    nextSequence = Math.max(1, Math.floor(Date.now()));
  }
  return formatClientOrderSlipReference(nextSequence);
}

function toOfflineInvoiceViewModel({ sale, invoiceId, reference, createdAt, paidAt }) {
  const productsById = new Map((state.products || []).map((p) => [String(p.id), p]));
  const lineItems = (sale?.items || []).map((item) => {
    const p = productsById.get(String(item.productId));
    const qty = Number(item.qty || 0);
    const price = Number(p?.price || 0);
    return {
      productId: item.productId,
      name: p?.name || `Product ${item.productId}`,
      qty,
      price,
      subtotal: price * qty
    };
  });

  const subtotal = lineItems.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
  const discount = Number(sale?.discountAmount || 0);
  const total = Math.max(0, subtotal - discount);
  const amountPaid = Number(sale?.amountTendered || total);
  return {
    id: invoiceId,
    reference,
    createdAt,
    updatedAt: paidAt,
    status: 'PAID',
    orderType: sale?.orderType || state.orderType || 'dine-in',
    paymentMethod: 'cash',
    subtotal,
    discount,
    discountProfile: normalizeInvoiceDiscountProfile(sale?.discountProfile),
    total,
    lineItems,
    payment: {
      method: 'cash',
      paidAt,
      amountPaid,
      change: Math.max(0, amountPaid - total),
      success: true,
      successMessage: 'Queued offline. Will sync when internet returns.'
    }
  };
}

async function getClientOfflineSummary() {
  if (!offlineOutbox?.getSummary) return { operations: 0, invoices: 0 };
  try {
    const summary = await offlineOutbox.getSummary();
    return {
      operations: Number(summary?.operations || 0),
      invoices: Number(summary?.invoices || 0)
    };
  } catch (_error) {
    return { operations: 0, invoices: 0 };
  }
}

function computeOfflineSaleBreakdown(sale) {
  const productsById = new Map((state.products || []).map((p) => [String(p.id), Number(p.price || 0)]));
  const totalQty = (sale?.items || []).reduce((sum, item) => sum + Number(item?.qty || 0), 0);
  const itemCount = Array.isArray(sale?.items) ? sale.items.length : 0;
  const productNames = (sale?.items || []).map((item) => {
    const productId = String(item?.productId || '');
    const p = (state.products || []).find((x) => String(x.id) === productId);
    return p?.name || `Product ${productId}`;
  });
  const subtotal = (sale?.items || []).reduce((sum, item) => {
    const price = Number(productsById.get(String(item?.productId)) || 0);
    const qty = Number(item?.qty || 0);
    return sum + (price * qty);
  }, 0);
  const discount = Number(sale?.discountAmount || 0);
  const total = Math.max(0, subtotal - discount);
  return { totalQty, itemCount, productNames, subtotal, total };
}

function computeOfflineSaleTotal(sale) {
  return computeOfflineSaleBreakdown(sale).total;
}

async function renderOfflinePendingTransactions() {
  if (!offlinePendingPanelEl || !offlinePendingListEl) return;
  if (!offlineOutbox?.listPendingSales) {
    offlinePendingPanelEl.style.display = 'none';
    return;
  }

  let ops = [];
  try {
    ops = await offlineOutbox.listPendingSales();
  } catch (_error) {
    offlinePendingPanelEl.style.display = 'none';
    return;
  }

  if (!Array.isArray(ops) || !ops.length) {
    offlinePendingPanelEl.style.display = 'none';
    offlinePendingListEl.innerHTML = '';
    return;
  }

  const rows = ops.slice(0, 25).map((op) => {
    const sale = op?.payload || {};
    const ref = String(sale.reference || sale.invoiceId || op.id || '-');
    const createdAt = formatDate(sale.createdAt || op.createdAt || new Date().toISOString());
    const retries = Number(op.retries || 0);
    const total = computeOfflineSaleTotal(sale);
    return `
      <div class="offline-pending-item">
        <div class="offline-pending-main">
          <div class="offline-pending-ref">${escapeHtml(ref)}</div>
          <div class="offline-pending-meta">${escapeHtml(createdAt)} | Retry: ${retries}</div>
        </div>
        <div class="offline-pending-total">${money(total)}</div>
      </div>
    `;
  });

  if (ops.length > 25) {
    rows.push(`<div class="offline-pending-empty">Showing latest 25 of ${ops.length} offline transactions.</div>`);
  }

  offlinePendingListEl.innerHTML = rows.join('');
  offlinePendingPanelEl.style.display = 'block';
}

async function queueOfflineCashSale({ items, amountTendered, discountAmount, orderType }) {
  if (!offlineOutbox?.enqueueCashSale) {
    throw new Error('Offline queue is not available in this browser.');
  }

  // This write targets IndexedDB (client device), not server/local SQLite.
  const createdAt = new Date().toISOString();
  const invoiceId = (window.crypto?.randomUUID?.() || `offline-${Date.now()}-${Math.floor(Math.random() * 1000000)}`);
  const reference = createClientInvoiceReference(invoiceId);
  const saleBreakdown = computeOfflineSaleBreakdown({ items, discountAmount });
  const cashierContext = getCashierInvoiceContext();
  const discountProfile = normalizeInvoiceDiscountProfile(getSelectedDiscountProfile());
  const payload = {
    operationId: `cash-sale-${invoiceId}`,
    invoiceId,
    reference,
    createdAt,
    items: items.map((x) => ({ productId: x.productId, qty: Number(x.qty || 0) })),
    totalQty: Number(saleBreakdown.totalQty || 0),
    itemCount: Number(saleBreakdown.itemCount || 0),
    productNames: Array.isArray(saleBreakdown.productNames) ? saleBreakdown.productNames : [],
    subtotalAmount: Number(saleBreakdown.subtotal || 0),
    totalAmount: Number(saleBreakdown.total || 0),
    amountTendered: Number(amountTendered || 0),
    discountAmount: Number(discountAmount || 0),
    discountProfile,
    orderType: String(orderType || 'dine-in'),
    cashierUserId: cashierContext.cashierUserId || null,
    cashierEmail: cashierContext.cashierEmail || null,
    cashierName: cashierContext.cashierName || null,
    cashierRole: cashierContext.cashierRole || null
  };
  await offlineOutbox.enqueueCashSale(payload);
  const paidAt = new Date().toISOString();
  return toOfflineInvoiceViewModel({ sale: payload, invoiceId, reference, createdAt, paidAt });
}

async function syncClientOfflineOutbox() {
  if (!offlineOutbox?.listPendingSales) {
    return { synced: 0, failed: 0, remaining: 0 };
  }

  // Replays device-stored offline cash sales to the live API once reachable.
  const ops = await offlineOutbox.listPendingSales();
  if (!Array.isArray(ops) || !ops.length) {
    return { synced: 0, failed: 0, remaining: 0 };
  }

  let synced = 0;
  let failed = 0;

  for (const op of ops) {
    try {
      const sale = op?.payload || {};
      const createdInvoice = await api('/api/invoices', {
        method: 'POST',
        body: JSON.stringify({
          items: Array.isArray(sale.items) ? sale.items : [],
          paymentMethod: 'cash',
          discountAmount: Number(sale.discountAmount || 0),
          discountProfile: sale.discountProfile || null,
          orderType: String(sale.orderType || 'dine-in'),
          clientInvoiceId: sale.invoiceId,
          clientReference: sale.reference,
          cashierUserId: sale.cashierUserId || activeAuthSession?.userId || null,
          cashierEmail: sale.cashierEmail || normalizeEmail(activeAuthSession?.email),
          cashierName: sale.cashierName || activeAuthSession?.name || null,
          cashierRole: sale.cashierRole || normalizeRoleChoice(activeAuthSession?.role)
        })
      });

      await api('/api/payments/cash', {
        method: 'POST',
        body: JSON.stringify({
          invoiceId: createdInvoice?.invoice?.id || sale.invoiceId,
          amountTendered: Number(sale.amountTendered || 0)
        })
      });

      await offlineOutbox.removeSale(op.id);
      synced += 1;
    } catch (error) {
      failed += 1;
      await offlineOutbox.incrementRetry(op.id).catch(() => {});
      if (isNetworkLikeError(error)) break;
    }
  }

  const summary = await getClientOfflineSummary();
  return { synced, failed, remaining: summary.operations };
}

function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function isValidEmail(value) {
  const email = normalizeEmail(value);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeRoleChoice(value) {
  const role = String(value || '').trim().toLowerCase();
  if (role === 'administrations' || role === 'supervisor' || role === 'encharge') {
    return role;
  }
  return 'encharge';
}

function isCashierRole(role) {
  return normalizeRoleChoice(role) === 'encharge';
}

function isDrawerOperatorRole(role) {
  const normalizedRole = normalizeRoleChoice(role);
  return normalizedRole === 'administrations'
    || normalizedRole === 'supervisor'
    || normalizedRole === 'encharge';
}

function canViewShiftMonitorOnPos(role) {
  return isCashierRole(role);
}

function parseNonNegativeAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount < 0) return null;
  return Math.round(amount * 100) / 100;
}

function getShiftReferenceBalance(shiftLike) {
  if (!shiftLike || typeof shiftLike !== 'object') return null;
  const endingCash = parseNonNegativeAmount(shiftLike.endingCash);
  if (endingCash !== null) return endingCash;
  const expectedCash = parseNonNegativeAmount(shiftLike.expectedCash);
  if (expectedCash !== null) return expectedCash;
  return parseNonNegativeAmount(shiftLike.startingCash);
}

function readPersistedCashierShiftState() {
  const rawShift = readUserUiState()?.cashierShiftState;
  if (!rawShift || typeof rawShift !== 'object') return null;
  const startingCash = parseNonNegativeAmount(rawShift.startingCash);
  if (startingCash === null) return null;
  const previousDrawerBalance = parseNonNegativeAmount(rawShift.previousDrawerBalance);
  const openingAdjustment = Number(rawShift.openingAdjustment || 0);
  return {
    shiftId: String(rawShift.shiftId || '').trim() || null,
    drawerId: String(rawShift.drawerId || '').trim() || null,
    drawerName: String(rawShift.drawerName || '').trim() || null,
    startedAt: String(rawShift.startedAt || new Date().toISOString()),
    startingCash,
    previousDrawerBalance,
    openingAdjustment: Number.isFinite(openingAdjustment) ? Math.round(openingAdjustment * 100) / 100 : 0
  };
}

function persistCashierShiftState(nextState, { resetSummary = true } = {}) {
  cashierShiftState = nextState || null;
  if (resetSummary) {
    latestShiftSummary = null;
  }
  if (activeAuthSession?.email) {
    saveUserUiState({ cashierShiftState: cashierShiftState });
  }
  updateCashOnHandBadge();
}

function clearCashierShiftState() {
  if (activeAuthSession?.email) {
    saveUserUiState({ cashierShiftState: null });
  }
  cashierShiftState = null;
  latestShiftSummary = null;
  updateCashOnHandBadge();
}

function hydrateCashierShiftState() {
  if (!activeAuthSession?.email || !isDrawerOperatorRole(activeAuthSession?.role)) {
    cashierShiftState = null;
    latestShiftSummary = null;
    updateCashOnHandBadge();
    return;
  }
  cashierShiftState = readPersistedCashierShiftState();
  latestShiftSummary = null;
  updateCashOnHandBadge();
}

function hasActiveCashierShift() {
  return Boolean(isDrawerOperatorRole(activeAuthSession?.role) && cashierShiftState?.startedAt);
}

function needsCashierShiftStart() {
  return Boolean(isDrawerOperatorRole(activeAuthSession?.role) && activeAuthSession?.email && !hasActiveCashierShift());
}

function updateShiftMonitorVisibility() {
  if (shiftMonitorToggleBtn) {
    shiftMonitorToggleBtn.style.display = (activeAuthSession?.email && canViewShiftMonitorOnPos(activeAuthSession?.role)) ? 'inline-flex' : 'none';
  }
  updateCashOnHandBadge();
}

function updateCashOnHandBadge() {
  if (!cashOnHandBadgeEl) return;
  if (!activeAuthSession?.email || !isDrawerOperatorRole(activeAuthSession?.role) || !cashierShiftState) {
    cashOnHandBadgeEl.style.display = 'none';
    return;
  }

  const expectedCash = parseNonNegativeAmount(latestShiftSummary?.expectedCashBalance);
  const displayedAmount = expectedCash === null
    ? Number(cashierShiftState.startingCash || 0)
    : expectedCash;
  const drawerLabel = String(cashierShiftState?.drawerName || '').trim();
  const label = expectedCash === null ? 'Cash On Hand (Start)' : 'Cash On Hand';
  cashOnHandBadgeEl.textContent = `${drawerLabel ? `${drawerLabel} | ` : ''}${label}: ${money(displayedAmount)}`;
  cashOnHandBadgeEl.style.display = 'inline-flex';
}

function toShiftSummaryView(summary, shift = null) {
  if (!summary) return null;
  const startingCash = Number(summary.startingCash ?? shift?.startingCash ?? 0);
  const cashPayments = Number(summary.cashPayments ?? summary.cashSales ?? 0);
  const cashTendered = Number(summary.cashTendered ?? shift?.cashTendered ?? cashPayments);
  const changeGiven = Number(summary.changeGiven ?? shift?.changeGiven ?? Math.max(0, cashTendered - cashPayments));
  const netCashRetained = Number(summary.netCashRetained ?? shift?.netCashRetained ?? (cashTendered - changeGiven));
  const cashWithdrawals = Number(summary.cashWithdrawals ?? shift?.cashWithdrawals ?? 0);
  const otherPayments = Number(summary.otherPayments ?? summary.digitalSales ?? 0);
  const totalSales = Number(summary.totalSales ?? 0);
  const holdForVoidCashAmount = Number(summary.holdForVoidCashAmount || 0);
  const voidedCashAmount = Number(summary.voidedCashAmount || 0);
  const expectedCashBalance = Number(summary.expectedCashBalance ?? (startingCash + cashPayments + holdForVoidCashAmount - cashWithdrawals));
  return {
    shiftId: String(summary.shiftId || shift?.id || '').trim() || null,
    drawerId: String(summary.drawerId || shift?.drawerId || '').trim() || null,
    drawerName: String(summary.drawerName || shift?.drawerName || '').trim() || null,
    startedAt: String(summary.startedAt || shift?.shiftStartAt || new Date().toISOString()),
    endedAt: String(summary.endedAt || shift?.shiftEndAt || '').trim() || null,
    startingCash,
    totalSales,
    totalTransactions: Number(summary.totalTransactions || 0),
    cashPayments,
    cashTendered,
    changeGiven,
    netCashRetained,
    cashWithdrawals,
    otherPayments,
    holdForVoidCount: Number(summary.holdForVoidCount || 0),
    holdForVoidAmount: Number(summary.holdForVoidAmount || 0),
    holdForVoidCashAmount,
    voidedCount: Number(summary.voidedCount || 0),
    voidedAmount: Number(summary.voidedAmount || 0),
    voidedCashAmount,
    paymentMethods: summary.paymentMethods || {},
    expectedCashBalance,
    endingCash: summary.endingCash === undefined || summary.endingCash === null ? null : Number(summary.endingCash),
    discrepancy: summary.discrepancy === undefined || summary.discrepancy === null ? null : Number(summary.discrepancy)
  };
}

async function ensureCashierShiftStarted({
  drawerId = null,
  startingCash,
  previousShiftId = null,
  previousDrawerBalance = null,
  openingAdjustment = null
} = {}) {
  if (!activeAuthSession?.email || !isDrawerOperatorRole(activeAuthSession?.role)) return null;

  const parsedStartingCash = parseNonNegativeAmount(startingCash);
  if (parsedStartingCash === null) {
    throw new Error('Cash on Hand is required before starting sales.');
  }
  const parsedPreviousDrawerBalance = parseNonNegativeAmount(previousDrawerBalance);
  const parsedOpeningAdjustment = openingAdjustment === null || openingAdjustment === undefined || openingAdjustment === ''
    ? null
    : Math.round(Number(openingAdjustment) * 100) / 100;
  if (parsedOpeningAdjustment !== null && !Number.isFinite(parsedOpeningAdjustment)) {
    throw new Error('Opening adjustment must be a valid amount.');
  }
  const safeDrawerId = String(drawerId || '').trim();
  if (!safeDrawerId) {
    throw new Error('Drawer name is required before starting sales.');
  }

  const { shift } = await api('/api/shifts/start', {
    method: 'POST',
    headers: buildActorHeaders(),
    body: JSON.stringify({
      drawerId: safeDrawerId,
      cashierUserId: activeAuthSession.userId || null,
      cashierEmail: activeAuthSession.email,
      cashierName: activeAuthSession.name || 'Cashier',
      cashierRole: normalizeRoleChoice(activeAuthSession.role),
      startingCash: parsedStartingCash,
      previousShiftId: String(previousShiftId || '').trim() || null,
      previousDrawerBalance: parsedPreviousDrawerBalance,
      openingAdjustment: parsedOpeningAdjustment
    })
  });

  const nextShiftState = {
    shiftId: String(shift?.id || '').trim() || null,
    drawerId: String(shift?.drawerId || safeDrawerId).trim() || null,
    drawerName: String(shift?.drawerName || startShiftContext?.drawerName || '').trim() || null,
    startedAt: String(shift?.shiftStartAt || new Date().toISOString()),
    startingCash: Number(shift?.startingCash ?? parsedStartingCash),
    previousDrawerBalance: parseNonNegativeAmount(shift?.previousDrawerBalance ?? parsedPreviousDrawerBalance),
    openingAdjustment: Number(shift?.openingAdjustment ?? (parsedOpeningAdjustment ?? 0))
  };
  persistCashierShiftState(nextShiftState);
  return shift;
}

function normalizePaymentMethod(method) {
  return String(method || '').trim().toLowerCase() || 'other';
}

function buildShiftSummary(transactions = [], {
  drawerId = null,
  drawerName = null,
  startingCash = 0,
  startedAt = null
} = {}) {
  const paidTransactions = (Array.isArray(transactions) ? transactions : [])
    .filter((t) => String(t?.status || '').toUpperCase() === 'PAID');

  let totalSales = 0;
  let cashPayments = 0;
  let cashTendered = 0;
  let changeGiven = 0;
  let otherPayments = 0;
  const paymentMethods = {};

  paidTransactions.forEach((txn) => {
    const amount = Number(txn?.total ?? 0);
    const safeAmount = Number.isFinite(amount) ? amount : 0;
    const method = normalizePaymentMethod(txn?.paymentMethod || txn?.payment?.method);

    totalSales += safeAmount;
    paymentMethods[method] = (paymentMethods[method] || 0) + safeAmount;
    if (method === 'cash') {
      cashPayments += safeAmount;
      const tendered = Number(txn?.payment?.amountPaid ?? safeAmount);
      const change = Number(txn?.payment?.change ?? 0);
      cashTendered += Number.isFinite(tendered) ? tendered : safeAmount;
      changeGiven += Number.isFinite(change) ? Math.max(0, change) : 0;
    }
    else otherPayments += safeAmount;
  });

  return {
    drawerId: String(drawerId || '').trim() || null,
    drawerName: String(drawerName || '').trim() || null,
    startedAt,
    startingCash: Number(startingCash || 0),
    totalSales,
    totalTransactions: paidTransactions.length,
    cashPayments,
    cashTendered,
    changeGiven,
    netCashRetained: cashTendered - changeGiven,
    otherPayments,
    paymentMethods,
    expectedCashBalance: Number(startingCash || 0) + cashPayments
  };
}

async function refreshLatestShiftSummary() {
  if (cashierShiftState?.shiftId) {
    try {
      const { shift, summary } = await api(`/api/shifts/${encodeURIComponent(cashierShiftState.shiftId)}/summary`, {
        headers: buildActorHeaders()
      });
      latestShiftSummary = toShiftSummaryView(summary, shift);
      persistCashierShiftState({
        shiftId: latestShiftSummary?.shiftId || cashierShiftState.shiftId,
        drawerId: latestShiftSummary?.drawerId || cashierShiftState.drawerId || null,
        drawerName: latestShiftSummary?.drawerName || cashierShiftState.drawerName || null,
        startedAt: latestShiftSummary?.startedAt || cashierShiftState.startedAt,
        startingCash: Number(latestShiftSummary?.startingCash ?? cashierShiftState.startingCash ?? 0),
        previousDrawerBalance: parseNonNegativeAmount(cashierShiftState?.previousDrawerBalance),
        openingAdjustment: Number(cashierShiftState?.openingAdjustment || 0)
      }, { resetSummary: false });
      return latestShiftSummary;
    } catch (error) {
      if (!isNetworkLikeError(error)) throw error;
    }
  }

  const defaultShiftStart = new Date();
  defaultShiftStart.setHours(0, 0, 0, 0);
  const shiftStartedAt = cashierShiftState?.startedAt || defaultShiftStart.toISOString();
  const startedAtTs = Date.parse(shiftStartedAt);
  const { transactions } = canAccessAdminFeatures()
    ? await api('/api/admin/transactions?status=PAID', {
      headers: buildActorHeaders()
    })
    : { transactions: [] };
  const activeUserId = String(activeAuthSession?.userId || '').trim();
  const activeEmail = normalizeEmail(activeAuthSession?.email);
  const paidTransactions = (Array.isArray(transactions) ? transactions : [])
    .filter((txn) => {
      if (!Number.isFinite(startedAtTs)) return true;
      const txnTs = Date.parse(txn?.payment?.paidAt || txn?.createdAt || '');
      return Number.isFinite(txnTs) && txnTs >= startedAtTs;
    })
    .filter((txn) => {
      if (activeUserId && txn?.cashierUserId) {
        return String(txn.cashierUserId) === activeUserId;
      }
      const txnEmail = normalizeEmail(txn?.cashierEmail);
      return txnEmail && txnEmail === activeEmail;
    });

  latestShiftSummary = buildShiftSummary(paidTransactions, {
    drawerId: cashierShiftState?.drawerId || null,
    drawerName: cashierShiftState?.drawerName || null,
    startedAt: shiftStartedAt,
    startingCash: parseNonNegativeAmount(cashierShiftState?.startingCash) || 0
  });
  updateCashOnHandBadge();
  return latestShiftSummary;
}

function formatDiscrepancyAmount(discrepancy) {
  if (!Number.isFinite(discrepancy)) return '—';
  if (discrepancy === 0) return 'Balanced';
  return discrepancy > 0
    ? `${money(discrepancy)} Overage`
    : `${money(Math.abs(discrepancy))} Shortage`;
}

function renderShiftSummary(containerEl, summary, { endingCash = null } = {}) {
  if (!containerEl || !summary) return;
  const expectedCash = Number(summary.expectedCashBalance || 0);
  const discrepancy = Number.isFinite(endingCash) ? (endingCash - expectedCash) : null;
  const startedAtText = summary.startedAt ? formatDate(summary.startedAt) : '—';
  const endedAtText = summary.endedAt ? formatDate(summary.endedAt) : 'Still active';

  const methodRows = Object.entries(summary.paymentMethods || {})
    .map(([method, amount]) => `
      <div class="shift-summary-line">
        <span class="shift-method-label">
          <img class="payment-method-icon" src="${escapeHtml(getPaymentMethodIcon(method))}" alt="${escapeHtml(getPaymentMethodLabel(method))}" />
          ${escapeHtml(getPaymentMethodLabel(method))}
        </span>
        <strong>${money(amount)}</strong>
      </div>
    `)
    .join('');

  containerEl.innerHTML = `
    <div class="shift-summary-line"><span>Drawer</span><strong>${escapeHtml(summary.drawerName || 'Drawer')}</strong></div>
    <div class="shift-summary-line"><span>Shift Start</span><strong>${escapeHtml(startedAtText)}</strong></div>
    <div class="shift-summary-line"><span>Shift End / Sign Out</span><strong>${escapeHtml(endedAtText)}</strong></div>
    <div class="shift-summary-line"><span>Total Sales</span><strong>${money(summary.totalSales || 0)}</strong></div>
    <div class="shift-summary-line"><span>Total Transactions</span><strong>${Number(summary.totalTransactions || 0)}</strong></div>
    <div class="shift-summary-line"><span>On Hold for Void</span><strong>${money(summary.holdForVoidAmount || 0)} (${Number(summary.holdForVoidCount || 0)})</strong></div>
    <div class="shift-summary-line"><span>Voided After Payment</span><strong>${money(summary.voidedAmount || 0)} (${Number(summary.voidedCount || 0)})</strong></div>
    <div class="shift-summary-line"><span>Cash Sales</span><strong>${money(summary.cashPayments || 0)}</strong></div>
    <div class="shift-summary-line"><span>Cash Tendered</span><strong>${money(summary.cashTendered || 0)}</strong></div>
    <div class="shift-summary-line"><span>Change Given</span><strong>${money(summary.changeGiven || 0)}</strong></div>
    <div class="shift-summary-line"><span>Net Cash Retained</span><strong>${money(summary.netCashRetained || 0)}</strong></div>
    <div class="shift-summary-line"><span>Admin Drawer Deductions</span><strong>${money(summary.cashWithdrawals || 0)}</strong></div>
    <div class="shift-summary-line"><span>Other Payment Methods</span><strong>${money(summary.otherPayments || 0)}</strong></div>
    <div class="shift-summary-line"><span>Starting Cash</span><strong>${money(summary.startingCash || 0)}</strong></div>
    <div class="shift-summary-line"><span>Expected Cash Balance</span><strong>${money(expectedCash)}</strong></div>
    <div class="shift-summary-line"><span>Entered Ending Balance</span><strong>${Number.isFinite(endingCash) ? money(endingCash) : '—'}</strong></div>
    <div class="shift-summary-line"><span>Discrepancy</span><strong>${escapeHtml(formatDiscrepancyAmount(discrepancy))}</strong></div>
    <div class="shift-summary-methods">${methodRows || '<p>No payment records yet.</p>'}</div>
  `;
}

function openShiftMonitorModal() {
  if (!shiftMonitorModalEl) return;
  shiftMonitorModalEl.classList.add('open');
  shiftMonitorModalEl.setAttribute('aria-hidden', 'false');
}

function closeShiftMonitorModal() {
  if (!shiftMonitorModalEl) return;
  shiftMonitorModalEl.classList.remove('open');
  shiftMonitorModalEl.setAttribute('aria-hidden', 'true');
}

async function showShiftMonitorSummary() {
  if (!shiftMonitorSummaryEl) return;
  shiftMonitorSummaryEl.innerHTML = '<p>Loading shift summary...</p>';

  try {
    if (!activeAuthSession?.email) {
      shiftMonitorSummaryEl.innerHTML = '<p>Login is required to view shift monitor.</p>';
      return;
    }
    const summary = await refreshLatestShiftSummary();
    renderShiftSummary(shiftMonitorSummaryEl, summary);
  } catch (error) {
    shiftMonitorSummaryEl.innerHTML = `<p class="error">Shift summary error: ${escapeHtml(error.message)}</p>`;
  }
}

function openStartShiftModal() {
  if (!startShiftModalEl) return;
  startShiftModalEl.classList.add('open');
  startShiftModalEl.setAttribute('aria-hidden', 'false');
}

function closeStartShiftModal() {
  if (!startShiftModalEl) return;
  startShiftModalEl.classList.remove('open');
  startShiftModalEl.setAttribute('aria-hidden', 'true');
  startShiftContext = null;
}

function renderStartShiftReference(reference = null) {
  const drawerName = String(reference?.drawerName || '').trim();
  const previousDrawerBalance = parseNonNegativeAmount(reference?.previousDrawerBalance);
  const previousShiftEndedAt = reference?.previousShiftEndedAt || null;
  if (startShiftDrawerNameEl) {
    startShiftDrawerNameEl.textContent = drawerName || 'No drawer selected';
  }
  if (startShiftPreviousBalanceEl) {
    startShiftPreviousBalanceEl.textContent = previousDrawerBalance === null
      ? 'No previous balance'
      : money(previousDrawerBalance);
  }
  if (startShiftPreviousEndedAtEl) {
    startShiftPreviousEndedAtEl.textContent = previousShiftEndedAt
      ? formatDate(previousShiftEndedAt)
      : 'No previous shift recorded';
  }
  if (startShiftReferenceStatusEl) {
    startShiftReferenceStatusEl.textContent = !drawerName
      ? 'Select a drawer name first.'
      : previousDrawerBalance === null
      ? 'No previous shift balance is on record yet. Enter the starting drawer amount, or use an adjustment only if your process requires one.'
      : 'Verify the displayed amount against the physical cash in the drawer. Use the previous balance if it matches, or enter a separate adjustment and apply it before starting the shift.';
  }
}

function updateStartShiftAdjustmentStatus() {
  if (!startShiftAdjustmentStatusEl) return;
  if (!startShiftContext?.drawerId) {
    startShiftAdjustmentStatusEl.textContent = 'Select a drawer name first.';
    return;
  }
  const enteredAmount = parseNonNegativeAmount(startShiftCashInputEl?.value);
  const previousDrawerBalance = parseNonNegativeAmount(startShiftContext?.previousDrawerBalance);
  const adjustmentValue = startShiftAdjustmentInputEl?.value;
  const hasAdjustmentValue = String(adjustmentValue ?? '').trim() !== '';
  const parsedAdjustment = hasAdjustmentValue ? Math.round(Number(adjustmentValue) * 100) / 100 : null;

  if (enteredAmount !== null) {
    startShiftAdjustmentStatusEl.textContent = `Prepared starting cash for this shift: ${money(enteredAmount)}.`;
    return;
  }
  if (hasAdjustmentValue && !Number.isFinite(parsedAdjustment)) {
    startShiftAdjustmentStatusEl.textContent = 'Cash adjustment must be a valid positive or negative amount.';
    return;
  }
  if (previousDrawerBalance !== null) {
    startShiftAdjustmentStatusEl.textContent = hasAdjustmentValue
      ? `Apply the adjustment to update the starting cash from ${money(previousDrawerBalance)}.`
      : `Use the previous balance or enter a cash adjustment before starting the shift.`;
    return;
  }
  startShiftAdjustmentStatusEl.textContent = 'Enter the starting drawer cash to begin this shift.';
}

async function fetchStartShiftContext() {
  const drawerId = String(startShiftDrawerSelectEl?.value || '').trim();
  if (!drawerId) {
    return {
      drawerId: null,
      drawerName: '',
      activeShift: null,
      previousShiftId: null,
      previousDrawerBalance: null,
      previousShiftEndedAt: null
    };
  }
  const result = await api(`/api/shifts/opening-context?drawerId=${encodeURIComponent(drawerId)}`, {
    headers: buildActorHeaders()
  });
  const previousShift = result?.previousShift || null;
  return {
    drawerId,
    drawerName: String(result?.drawer?.name || '').trim() || '',
    activeShift: result?.activeShift || null,
    previousShiftId: String(previousShift?.id || '').trim() || null,
    previousDrawerBalance: parseNonNegativeAmount(result?.previousDrawerBalance),
    previousShiftEndedAt: previousShift?.shiftEndAt || null
  };
}

async function populateStartShiftDrawerOptions(selectedDrawerId = '') {
  if (!startShiftDrawerSelectEl) return;
  const result = await api('/api/cash-drawers', {
    headers: buildActorHeaders()
  });
  const drawers = Array.isArray(result?.drawers) ? result.drawers : [];
  startShiftDrawerSelectEl.innerHTML = ['<option value="">Select drawer</option>']
    .concat(drawers.map((drawer) => `
      <option value="${escapeHtml(drawer.id || '')}">${escapeHtml(drawer.name || 'Drawer')}</option>
    `))
    .join('');
  if (selectedDrawerId && drawers.some((drawer) => String(drawer.id || '') === selectedDrawerId)) {
    startShiftDrawerSelectEl.value = selectedDrawerId;
  }
  return drawers;
}

async function loadSelectedStartShiftDrawerContext() {
  startShiftContext = await fetchStartShiftContext();
  renderStartShiftReference(startShiftContext);

  if (!startShiftContext?.drawerId) {
    if (startShiftCashInputEl) startShiftCashInputEl.value = '';
    if (startShiftAdjustmentInputEl) startShiftAdjustmentInputEl.value = '';
    updateStartShiftAdjustmentStatus();
    return;
  }

  const activeShift = startShiftContext?.activeShift || null;
  if (activeShift?.id && String(activeShift?.status || '').toLowerCase() === 'active') {
    persistCashierShiftState({
      shiftId: String(activeShift.id || '').trim() || null,
      drawerId: String(activeShift.drawerId || startShiftContext.drawerId || '').trim() || null,
      drawerName: String(activeShift.drawerName || startShiftContext.drawerName || '').trim() || null,
      startedAt: String(activeShift.shiftStartAt || new Date().toISOString()),
      startingCash: Number(activeShift.startingCash || 0),
      previousDrawerBalance: parseNonNegativeAmount(activeShift.previousDrawerBalance),
      openingAdjustment: Number(activeShift.openingAdjustment || 0)
    });
    closeStartShiftModal();
    setStatus(`Resumed ${activeShift.drawerName || 'drawer'} shift started at ${formatDate(activeShift.shiftStartAt)}.`);
    return;
  }

  if (startShiftCashInputEl) {
    startShiftCashInputEl.value = '';
    startShiftCashInputEl.focus();
  }
  if (startShiftAdjustmentInputEl) startShiftAdjustmentInputEl.value = '';
  updateStartShiftAdjustmentStatus();
}

async function presentStartShiftModal() {
  if (!needsCashierShiftStart()) return;

  openStartShiftModal();
  startShiftContext = null;
  renderStartShiftReference(null);
  if (startShiftCashInputEl) startShiftCashInputEl.value = '';
  if (startShiftAdjustmentInputEl) startShiftAdjustmentInputEl.value = '';
  if (startShiftReferenceStatusEl) {
    startShiftReferenceStatusEl.textContent = 'Loading drawers...';
  }
  updateStartShiftAdjustmentStatus();

  try {
    const selectedDrawerId = String(cashierShiftState?.drawerId || '').trim();
    const drawers = await populateStartShiftDrawerOptions(selectedDrawerId);
    if (!Array.isArray(drawers) || !drawers.length) {
      startShiftContext = {
        drawerId: null,
        drawerName: '',
        activeShift: null,
        previousShiftId: null,
        previousDrawerBalance: null,
        previousShiftEndedAt: null
      };
      renderStartShiftReference(startShiftContext);
      if (startShiftReferenceStatusEl) {
        startShiftReferenceStatusEl.textContent = 'No cash drawer has been created yet. An Administrator must create a drawer name and set its first amount before a user can start sales.';
      }
      if (startShiftAdjustmentStatusEl) {
        startShiftAdjustmentStatusEl.textContent = 'Waiting for an Administrator to set up a drawer.';
      }
      return;
    }
    await loadSelectedStartShiftDrawerContext();
  } catch (error) {
    startShiftContext = {
      drawerId: null,
      drawerName: '',
      activeShift: null,
      previousShiftId: null,
      previousDrawerBalance: null,
      previousShiftEndedAt: null
    };
    renderStartShiftReference(startShiftContext);
    if (startShiftReferenceStatusEl) {
      startShiftReferenceStatusEl.textContent = `Unable to load the previous drawer balance: ${error.message}. Enter the counted drawer cash to continue.`;
    }
    if (startShiftCashInputEl) startShiftCashInputEl.focus();
    if (startShiftAdjustmentInputEl) startShiftAdjustmentInputEl.value = '';
    updateStartShiftAdjustmentStatus();
  }
}

async function requireCashierShiftForTransactions(message = 'Start the shift first before processing transactions.') {
  if (!needsCashierShiftStart()) return true;
  setStatus(message);
  await presentStartShiftModal();
  return false;
}

function usePreviousStartShiftBalance() {
  if (!startShiftContext?.drawerId) {
    if (startShiftAdjustmentStatusEl) {
      startShiftAdjustmentStatusEl.textContent = 'Select a drawer name first.';
    }
    if (startShiftDrawerSelectEl) startShiftDrawerSelectEl.focus();
    return;
  }
  const previousDrawerBalance = parseNonNegativeAmount(startShiftContext?.previousDrawerBalance);
  if (previousDrawerBalance === null) {
    if (startShiftAdjustmentStatusEl) {
      startShiftAdjustmentStatusEl.textContent = 'No previous balance is available. Enter the starting drawer cash manually.';
    }
    if (startShiftCashInputEl) startShiftCashInputEl.focus();
    return;
  }
  if (startShiftCashInputEl) startShiftCashInputEl.value = String(previousDrawerBalance);
  if (startShiftAdjustmentInputEl) startShiftAdjustmentInputEl.value = '0';
  updateStartShiftAdjustmentStatus();
}

function applyStartShiftAdjustment() {
  if (!startShiftContext?.drawerId) {
    if (startShiftAdjustmentStatusEl) {
      startShiftAdjustmentStatusEl.textContent = 'Select a drawer name first.';
    }
    if (startShiftDrawerSelectEl) startShiftDrawerSelectEl.focus();
    return;
  }
  const previousDrawerBalance = parseNonNegativeAmount(startShiftContext?.previousDrawerBalance);
  if (previousDrawerBalance === null) {
    if (startShiftAdjustmentStatusEl) {
      startShiftAdjustmentStatusEl.textContent = 'No previous balance is available to adjust. Enter the starting drawer cash directly.';
    }
    if (startShiftCashInputEl) startShiftCashInputEl.focus();
    return;
  }

  const rawAdjustment = String(startShiftAdjustmentInputEl?.value || '').trim();
  if (!rawAdjustment) {
    if (startShiftAdjustmentStatusEl) {
      startShiftAdjustmentStatusEl.textContent = 'Enter a positive or negative adjustment amount first.';
    }
    if (startShiftAdjustmentInputEl) startShiftAdjustmentInputEl.focus();
    return;
  }

  const adjustment = Math.round(Number(rawAdjustment) * 100) / 100;
  if (!Number.isFinite(adjustment)) {
    if (startShiftAdjustmentStatusEl) {
      startShiftAdjustmentStatusEl.textContent = 'Cash adjustment must be a valid number.';
    }
    if (startShiftAdjustmentInputEl) startShiftAdjustmentInputEl.focus();
    return;
  }

  const adjustedAmount = Math.round((previousDrawerBalance + adjustment) * 100) / 100;
  if (adjustedAmount < 0) {
    if (startShiftAdjustmentStatusEl) {
      startShiftAdjustmentStatusEl.textContent = 'The adjusted drawer balance cannot be negative.';
    }
    if (startShiftAdjustmentInputEl) startShiftAdjustmentInputEl.focus();
    return;
  }

  if (startShiftCashInputEl) startShiftCashInputEl.value = String(adjustedAmount);
  updateStartShiftAdjustmentStatus();
}

function openCashoutSummaryModal() {
  if (!cashoutSummaryModalEl) return;
  cashoutSummaryModalEl.classList.add('open');
  cashoutSummaryModalEl.setAttribute('aria-hidden', 'false');
}

function closeCashoutSummaryModal() {
  if (!cashoutSummaryModalEl) return;
  cashoutSummaryModalEl.classList.remove('open');
  cashoutSummaryModalEl.setAttribute('aria-hidden', 'true');
}

function buildCashoutReport(summary, endingCash) {
  const expectedCash = Number(summary.expectedCashBalance || 0);
  const discrepancy = Number(endingCash || 0) - expectedCash;
  return {
    generatedAt: new Date().toISOString(),
    user: {
      id: activeAuthSession?.userId || null,
      email: activeAuthSession?.email || null,
      name: activeAuthSession?.name || 'User',
      role: activeAuthSession?.role || 'encharge'
    },
    summary: {
      shiftStartedAt: summary.startedAt || null,
      shiftEndedAt: summary.endedAt || null,
      totalSales: summary.totalSales || 0,
      totalTransactions: summary.totalTransactions || 0,
      cashPayments: summary.cashPayments || 0,
      cashTendered: summary.cashTendered || 0,
      changeGiven: summary.changeGiven || 0,
      netCashRetained: summary.netCashRetained || 0,
      otherPayments: summary.otherPayments || 0,
      paymentMethods: summary.paymentMethods || {},
      startingCash: summary.startingCash || 0,
      expectedCashBalance: expectedCash,
      enteredEndingBalance: endingCash,
      discrepancy
    }
  };
}

function downloadCashoutReport(report) {
  if (!report) return;
  const lines = [
    `Cashier Shift Summary - ${report.generatedAt}`,
    `User: ${report.user.name} (${report.user.email})`,
    `Role: ${report.user.role}`,
    `Shift Start: ${report.summary.shiftStartedAt || 'N/A'}`,
    `Shift End / Sign Out: ${report.summary.shiftEndedAt || 'N/A'}`,
    `Total Sales: ${money(report.summary.totalSales)}`,
    `Total Transactions: ${report.summary.totalTransactions}`,
    `Cash Sales: ${money(report.summary.cashPayments)}`,
    `Cash Tendered: ${money(report.summary.cashTendered || 0)}`,
    `Change Given: ${money(report.summary.changeGiven || 0)}`,
    `Net Cash Retained: ${money(report.summary.netCashRetained || 0)}`,
    `Other Payment Methods: ${money(report.summary.otherPayments)}`,
    `Starting Cash: ${money(report.summary.startingCash)}`,
    `Expected Cash Balance: ${money(report.summary.expectedCashBalance)}`,
    `Entered Ending Balance: ${money(report.summary.enteredEndingBalance)}`,
    `Discrepancy: ${formatDiscrepancyAmount(report.summary.discrepancy)}`
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `cashier-shift-summary-${Date.now()}.txt`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function printCashoutReport(report) {
  if (!report) return;
  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=760,height=840');
  if (!printWindow) return;
  const summary = report.summary || {};
  printWindow.document.write(`
    <html>
      <head><title>Cashier Shift Summary</title></head>
      <body style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Cashier Shift Summary</h2>
        <p><strong>Generated:</strong> ${escapeHtml(formatDate(report.generatedAt))}</p>
        <p><strong>User:</strong> ${escapeHtml(report.user?.name || 'User')} (${escapeHtml(report.user?.email || '-')})</p>
        <p><strong>Shift Start:</strong> ${escapeHtml(summary.shiftStartedAt ? formatDate(summary.shiftStartedAt) : 'N/A')}</p>
        <p><strong>Shift End / Sign Out:</strong> ${escapeHtml(summary.shiftEndedAt ? formatDate(summary.shiftEndedAt) : 'N/A')}</p>
        <hr />
        <p><strong>Total Sales:</strong> ${escapeHtml(money(summary.totalSales || 0))}</p>
        <p><strong>Total Transactions:</strong> ${Number(summary.totalTransactions || 0)}</p>
        <p><strong>Cash Sales:</strong> ${escapeHtml(money(summary.cashPayments || 0))}</p>
        <p><strong>Cash Tendered:</strong> ${escapeHtml(money(summary.cashTendered || 0))}</p>
        <p><strong>Change Given:</strong> ${escapeHtml(money(summary.changeGiven || 0))}</p>
        <p><strong>Net Cash Retained:</strong> ${escapeHtml(money(summary.netCashRetained || 0))}</p>
        <p><strong>Other Payment Methods:</strong> ${escapeHtml(money(summary.otherPayments || 0))}</p>
        <p><strong>Expected Cash Balance:</strong> ${escapeHtml(money(summary.expectedCashBalance || 0))}</p>
        <p><strong>Entered Ending Balance:</strong> ${escapeHtml(money(summary.enteredEndingBalance || 0))}</p>
        <p><strong>Discrepancy:</strong> ${escapeHtml(formatDiscrepancyAmount(summary.discrepancy))}</p>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function readActiveSession() {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.email) return null;
    return parsed;
  } catch (_error) {
    return null;
  }
}

function writeActiveSession(user) {
  const sessionUser = {
    name: user.name,
    email: user.email,
    role: user.role || 'encharge',
    userId: user.userId || null
  };
  activeAuthSession = sessionUser;
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(sessionUser));
  updateShiftMonitorVisibility();
  restoreAdminNavOrder();
}

function clearActiveSession() {
  activeAuthSession = null;
  cashierShiftState = null;
  latestShiftSummary = null;
  startShiftContext = null;
  closeStartShiftModal();
  localStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  updateShiftMonitorVisibility();
  restoreAdminNavOrder();
}

function writeAccessToken(token) {
  if (!token) return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

function readAccessToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY) || '';
}

function readOfflineAuthCache() {
  try {
    const raw = localStorage.getItem(AUTH_OFFLINE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.email || !parsed.passwordHash) return null;
    return parsed;
  } catch (_error) {
    return null;
  }
}

async function sha256Hex(input) {
  const text = String(input || '');
  if (!window.crypto?.subtle) return '';
  const bytes = new TextEncoder().encode(text);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function cacheOfflineAuthCredential({ name, email, role, userId, password }) {
  if (!email || !password) return;
  const passwordHash = await sha256Hex(password);
  if (!passwordHash) return;
  const payload = {
    name: String(name || '').trim() || 'User',
    email: normalizeEmail(email),
    role: String(role || 'encharge').toLowerCase(),
    userId: userId || null,
    passwordHash,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem(AUTH_OFFLINE_CACHE_KEY, JSON.stringify(payload));
}

async function tryOfflineLogin(email, password) {
  const cached = readOfflineAuthCache();
  if (!cached) return null;
  if (normalizeEmail(cached.email) !== normalizeEmail(email)) return null;

  const updatedAtTs = new Date(cached.updatedAt || '').getTime();
  if (!Number.isFinite(updatedAtTs) || (Date.now() - updatedAtTs) > OFFLINE_AUTH_MAX_AGE_MS) {
    return null;
  }

  const inputHash = await sha256Hex(password);
  if (!inputHash || inputHash !== cached.passwordHash) return null;

  return {
    name: cached.name || 'User',
    email: cached.email,
    role: cached.role || 'encharge',
    userId: cached.userId || null
  };
}

function getUserUiStateKey() {
  const userKey = activeAuthSession?.userId || activeAuthSession?.email || 'guest';
  return `${UI_STATE_KEY_PREFIX}${userKey}`;
}

function getCatalogCacheKey() {
  const userKey = activeAuthSession?.userId || activeAuthSession?.email || 'guest';
  return `${CATALOG_CACHE_KEY_PREFIX}${userKey}`;
}

function readUserUiState() {
  try {
    const raw = localStorage.getItem(getUserUiStateKey());
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_error) {
    return {};
  }
}

function saveUserUiState(patch) {
  try {
    const current = readUserUiState();
    const next = { ...current, ...patch };
    localStorage.setItem(getUserUiStateKey(), JSON.stringify(next));
  } catch (_error) {
    // Ignore local storage errors.
  }
}

function readCatalogCache() {
  try {
    const raw = localStorage.getItem(getCatalogCacheKey());
    const globalRaw = localStorage.getItem(CATALOG_CACHE_GLOBAL_KEY);
    const parsed = raw ? JSON.parse(raw) : (globalRaw ? JSON.parse(globalRaw) : null);
    if (!parsed || typeof parsed !== 'object') return null;
    const categories = Array.isArray(parsed.categories) ? parsed.categories : [];
    const products = Array.isArray(parsed.products) ? parsed.products : [];
    if (!categories.length && !products.length) return null;
    return { categories, products };
  } catch (_error) {
    return null;
  }
}

function writeCatalogCache(payload) {
  try {
    const snapshot = JSON.stringify({
      categories: Array.isArray(payload?.categories) ? payload.categories : [],
      products: Array.isArray(payload?.products) ? payload.products : [],
      updatedAt: new Date().toISOString()
    });
    localStorage.setItem(getCatalogCacheKey(), snapshot);
    localStorage.setItem(CATALOG_CACHE_GLOBAL_KEY, snapshot);
  } catch (_error) {
    // Ignore cache write issues.
  }
}

function getBootstrapCatalogFallback() {
  return {
    categories: BOOTSTRAP_CATALOG_FALLBACK.categories.map((x) => ({ ...x })),
    products: BOOTSTRAP_CATALOG_FALLBACK.products.map((x) => ({ ...x }))
  };
}

function hydrateCatalogState(cached, { keepCategory = true } = {}) {
  if (!cached || (!Array.isArray(cached.categories) && !Array.isArray(cached.products))) return false;

  const nextCategories = Array.isArray(cached.categories) ? cached.categories : [];
  const nextProducts = Array.isArray(cached.products) ? cached.products : [];

  state.categories = nextCategories.map((x) => ({
    key: String(x.key || '').trim().toLowerCase(),
    name: String(x.name || '').trim() || String(x.key || ''),
    image: String(x.image || '').trim() || getDefaultCategoryImage(x.key),
    sortOrder: Number(x.sortOrder || 0)
  }));
  state.products = nextProducts.map((x) => ({
    ...toClientProduct(x)
  }));

  if (!state.categories.length) {
    state.categories = [{
      key: 'main-dish',
      name: 'Main Dish',
      image: '/Menu/Main Dish.png',
      sortOrder: 10
    }];
  }

  const categoryKeys = new Set(state.categories.map((x) => x.key));
  if (!keepCategory || !categoryKeys.has(String(state.activeCategory || '').toLowerCase())) {
    state.activeCategory = state.categories[0].key;
  }

  return true;
}

function isAdminRole(role = activeAuthSession?.role) {
  return normalizeRoleChoice(role) === 'administrations';
}

function isAdminOrSupervisorRole(role = activeAuthSession?.role) {
  const normalizedRole = normalizeRoleChoice(role);
  return normalizedRole === 'administrations' || normalizedRole === 'supervisor';
}

function canAccessAdminFeatures() {
  return isAdminOrSupervisorRole();
}

function canManageInventory() {
  return isAdminRole();
}

function getRoleAccessConfig() {
  return normalizeRoleAccessConfig(state.appConfig?.roleAccess);
}

function hasRoleAccess(permissionKey, role = activeAuthSession?.role) {
  const normalizedRole = normalizeRoleChoice(role);
  if (normalizedRole === 'administrations') return true;
  const safePermissionKey = String(permissionKey || '').trim().toLowerCase();
  const roleAccess = getRoleAccessConfig();
  return Array.isArray(roleAccess?.[normalizedRole]) && roleAccess[normalizedRole].includes(safePermissionKey);
}

function hasConfiguredRoleAccess(permissionKey, role = activeAuthSession?.role) {
  const normalizedRole = normalizeRoleChoice(role);
  if (normalizedRole === 'administrations') return false;
  const safePermissionKey = String(permissionKey || '').trim().toLowerCase();
  const roleAccess = getRoleAccessConfig();
  return Array.isArray(roleAccess?.[normalizedRole]) && roleAccess[normalizedRole].includes(safePermissionKey);
}

function canAccessMenuEditor() {
  return isAdminOrSupervisorRole();
}

function canAccessCashDrawerControl() {
  return isAdminOrSupervisorRole();
}

function canAccessInventoryPanel() {
  return isAdminOrSupervisorRole();
}

function canAccessKitSpecPanel() {
  return isAdminOrSupervisorRole();
}

function canViewUserDirectory() {
  return isAdminOrSupervisorRole();
}

function canAccessOperationsPanel() {
  return isAdminOrSupervisorRole();
}

function canAccessReceiptTemplatesPanel() {
  return isAdminOrSupervisorRole();
}

function canAccessReportsPanel() {
  return isAdminOrSupervisorRole();
}

function canAccessDiscountManager() {
  return isAdminOrSupervisorRole();
}

function canManageDiscounts() {
  return isAdminRole();
}

function canAccessMonthlyClosing() {
  return isAdminOrSupervisorRole();
}

function canManageMonthlyExpenses() {
  return isAdminRole();
}

function canManageInvoiceActions() {
  return isCashierRole(activeAuthSession?.role);
}

const DEFAULT_DISCOUNT_PROFILES = Object.freeze([
  { id: 'student', name: 'Students', type: 'percent', amount: 10 },
  { id: 'senior', name: 'Seniors', type: 'percent', amount: 20 },
  { id: 'pwd', name: 'PWD', type: 'percent', amount: 20 }
]);
const ROLE_ACCESS_CATALOG = Object.freeze([
  { key: 'control_center_access', label: 'Control Center Dashboard', description: 'Open the Control Center dashboard and overview workspace.' },
  { key: 'menu_editor_access', label: 'Edit Menu', description: 'Open the menu editor from Settings and update menu items.' },
  { key: 'cash_drawer_access', label: 'Cash Drawer Control', description: 'Open the cash drawer control workspace from Settings.' },
  { key: 'inventory_access', label: 'Inventory Snapshot', description: 'View stock overview, ingredient value, and ingredient history.' },
  { key: 'inventory_manage', label: 'Inventory Management', description: 'Add, edit, delete, and bulk update ingredient records.' },
  { key: 'kit_spec_access', label: 'Kit Specification', description: 'View and save product ingredient mappings.' },
  { key: 'user_directory_access', label: 'User Directory', description: 'View the user account directory and role summary.' },
  { key: 'user_management_manage', label: 'User Management', description: 'Create users, change roles, activate, and reset passwords.' },
  { key: 'operations_access', label: 'Operations Dashboard', description: 'View cashier monitoring, shifts, discrepancies, and drawer status.' },
  { key: 'receipt_templates_access', label: 'Receipt Template Studio', description: 'View order slip templates and live previews.' },
  { key: 'receipt_templates_manage', label: 'Receipt Template Management', description: 'Create, update, activate, and delete order slip templates.' },
  { key: 'reports_access', label: 'Reports Dashboard', description: 'View reports, sales analytics, and dashboard charts.' },
  { key: 'discounts_access', label: 'Customer Discounts', description: 'View saved customer discount types.' },
  { key: 'discounts_manage', label: 'Discount Management', description: 'Create, update, and delete customer discount types.' },
  { key: 'monthly_closing_access', label: 'Monthly Closing', description: 'View monthly closing and expense summaries.' },
  { key: 'monthly_expenses_manage', label: 'Expense Management', description: 'Add monthly expense entries.' },
  { key: 'shift_session_access', label: 'Shift Session', description: 'Start and end drawer shifts and keep cash-on-hand tracking active.' },
  { key: 'shift_monitor_access', label: 'Shift Monitor', description: 'Open the POS shift monitor button.' },
  { key: 'invoice_action_access', label: 'Invoice Hold / Void', description: 'Use hold-for-void and related receipt status actions.' }
]);
const ROLE_ACCESS_LABELS = Object.freeze(
  ROLE_ACCESS_CATALOG.reduce((rows, item) => {
    rows[item.key] = item.label;
    return rows;
  }, {})
);
const DEFAULT_ROLE_ACCESS = Object.freeze({
  encharge: Object.freeze([
    'shift_session_access',
    'shift_monitor_access',
    'invoice_action_access'
  ]),
  supervisor: Object.freeze([
    'control_center_access',
    'menu_editor_access',
    'cash_drawer_access',
    'inventory_access',
    'kit_spec_access',
    'user_directory_access',
    'operations_access',
    'receipt_templates_access',
    'reports_access',
    'discounts_access',
    'monthly_closing_access',
    'shift_session_access',
    'invoice_action_access'
  ])
});
const ROLE_ACCESS_SUMMARY = Object.freeze({
  encharge: Object.freeze([
    'shift_session_access',
    'shift_monitor_access',
    'invoice_action_access'
  ]),
  supervisor: Object.freeze([
    'control_center_access',
    'menu_editor_access',
    'cash_drawer_access',
    'inventory_access',
    'kit_spec_access',
    'user_directory_access',
    'operations_access',
    'receipt_templates_access',
    'reports_access',
    'discounts_access',
    'monthly_closing_access'
  ])
});

function normalizeRoleAccessEntries(entries = [], fallback = []) {
  const source = Array.isArray(entries) ? entries : fallback;
  const seenKeys = new Set();
  return source.reduce((rows, entry) => {
    const key = String(entry || '').trim().toLowerCase();
    if (!ROLE_ACCESS_LABELS[key] || seenKeys.has(key)) return rows;
    seenKeys.add(key);
    rows.push(key);
    return rows;
  }, []);
}

function normalizeRoleAccessConfig(roleAccess = {}) {
  const source = roleAccess && typeof roleAccess === 'object' ? roleAccess : {};
  return {
    encharge: normalizeRoleAccessEntries(source?.encharge, DEFAULT_ROLE_ACCESS.encharge),
    supervisor: normalizeRoleAccessEntries(source?.supervisor, DEFAULT_ROLE_ACCESS.supervisor)
  };
}

function normalizeDiscountProfileId(value, fallback = 'discount') {
  return String(value || fallback)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64) || fallback;
}

function normalizeDiscountProfile(profile = {}, index = 0) {
  const name = String(profile?.name || '').trim().slice(0, 60) || `Discount ${index + 1}`;
  const type = String(profile?.type || '').trim().toLowerCase() === 'fixed' ? 'fixed' : 'percent';
  const legacyPercent = Number(profile?.percent);
  const rawAmount = profile?.amount !== undefined ? Number(profile.amount) : legacyPercent;
  const amount = Number.isFinite(rawAmount)
    ? (type === 'percent' ? Math.min(100, Math.max(0, rawAmount)) : Math.max(0, rawAmount))
    : 0;
  return {
    id: normalizeDiscountProfileId(profile?.id || name, `discount-${index + 1}`),
    name,
    type,
    amount
  };
}

function normalizeDiscountProfiles(profiles = []) {
  const source = Array.isArray(profiles)
    ? profiles
    : DEFAULT_DISCOUNT_PROFILES;
  const seenIds = new Set();
  return source.reduce((rows, profile, index) => {
    const normalized = normalizeDiscountProfile(profile, index);
    let nextId = normalized.id;
    let suffix = 2;
    while (seenIds.has(nextId)) {
      nextId = `${normalized.id}-${suffix}`;
      suffix += 1;
    }
    seenIds.add(nextId);
    rows.push({
      ...normalized,
      id: nextId
    });
    return rows;
  }, []);
}

function normalizeAppConfig(config = {}) {
  return {
    enforceKitSpec: config?.enforceKitSpec !== false,
    discountProfiles: normalizeDiscountProfiles(config?.discountProfiles),
    roleAccess: normalizeRoleAccessConfig(config?.roleAccess)
  };
}

const DEFAULT_RECEIPT_TEMPLATE = Object.freeze({
  id: 'classic-roast-beef',
  name: 'Classic Official',
  settings: {
    paperWidthMm: 80,
    paddingPx: 12,
    borderRadiusPx: 12,
    fontFamily: "'Trebuchet MS', 'Arial', sans-serif",
    baseFontSizePx: 13,
    titleFontSizePx: 24,
    metaFontSizePx: 12,
    totalFontSizePx: 16,
    sectionGapPx: 10,
    logoUrl: '/Business Logo/Ruels Logo for business.png',
    showLogo: true,
    logoWidthPx: 78,
    headerAlign: 'center',
    footerAlign: 'center',
    backgroundColor: '#ffffff',
    textColor: '#432716',
    accentColor: '#5a3521',
    mutedColor: '#7b5a47',
    borderColor: '#c8a88f',
    borderStyle: 'dashed',
    dividerStyle: 'dashed',
    orderSlipTitle: 'Order Slip',
    storeName: "Ruel's Roast Beef",
    storeAddress: 'Location : Tres Martires, City of Baybay, 6521 Leyte',
    taxLine: 'Vat Registered TIN 342-231-312-00000',
    showDiscountProfileType: true,
    discountProfileLabel: 'Customer Discount Type',
    footerMessage: 'Thank you for dining with us!',
    extraMessage: '',
    extraMessageAlign: 'center',
    extraMessageStyle: 'dashed',
    footerFontSizePx: 12,
    footerTopSpacingPx: 12,
    headerTopPaddingPx: 0,
    headerOffsetX: 0,
    headerOffsetY: 0,
    metaOffsetX: 0,
    metaOffsetY: 0,
    itemsOffsetX: 0,
    itemsOffsetY: 0,
    totalsOffsetX: 0,
    totalsOffsetY: 0,
    footerOffsetX: 0,
    footerOffsetY: 0,
    extraMessageOffsetX: 0,
    extraMessageOffsetY: 0
  }
});
const RECEIPT_TEMPLATE_SAMPLE = Object.freeze({
  reference: 'OR-0000000000001',
  paidAt: '2026-03-12T03:57:00.000Z',
  orderType: 'dine-in',
  paymentMethod: 'cash',
  subtotal: 249,
  discount: 24.9,
  discountProfile: {
    name: 'Students',
    type: 'percent',
    amount: 10
  },
  total: 224.1,
  payment: {
    amountPaid: 230,
    change: 5.9
  },
  lineItems: [
    { name: 'Succulent Roast Beef', qty: 1, subtotal: 249 }
  ]
});
const RECEIPT_TEMPLATE_LOCAL_DRAFT_KEY = '__draft__';
let receiptTemplatePreviewDragState = null;

function normalizeTemplateName(name) {
  return String(name || '').trim().slice(0, 80);
}

function normalizeTemplateText(value, fallback, maxLength = 180) {
  const text = String(value || '').trim();
  return text ? text.slice(0, maxLength) : fallback;
}

function normalizeTemplateColor(value, fallback) {
  const color = String(value || '').trim();
  return /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(color) ? color : fallback;
}

function clampTemplateNumber(value, min, max, fallback) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.min(max, Math.max(min, numeric));
}

function normalizeTemplateAlign(value, fallback = 'center') {
  const align = String(value || '').trim().toLowerCase();
  return ['left', 'center', 'right'].includes(align) ? align : fallback;
}

function normalizeTemplateBorderStyle(value, fallback = 'dashed') {
  const style = String(value || '').trim().toLowerCase();
  return ['solid', 'dashed', 'dotted', 'none'].includes(style) ? style : fallback;
}

function normalizeReceiptTemplateSettings(settings = {}) {
  const defaults = DEFAULT_RECEIPT_TEMPLATE.settings;
  return {
    paperWidthMm: clampTemplateNumber(settings?.paperWidthMm, 58, 100, defaults.paperWidthMm),
    paddingPx: clampTemplateNumber(settings?.paddingPx, 0, 32, defaults.paddingPx),
    borderRadiusPx: clampTemplateNumber(settings?.borderRadiusPx, 0, 32, defaults.borderRadiusPx),
    fontFamily: String(settings?.fontFamily || defaults.fontFamily).trim() || defaults.fontFamily,
    baseFontSizePx: clampTemplateNumber(settings?.baseFontSizePx, 10, 20, defaults.baseFontSizePx),
    titleFontSizePx: clampTemplateNumber(settings?.titleFontSizePx, 14, 36, defaults.titleFontSizePx),
    metaFontSizePx: clampTemplateNumber(settings?.metaFontSizePx, 10, 18, defaults.metaFontSizePx),
    totalFontSizePx: clampTemplateNumber(settings?.totalFontSizePx, 12, 28, defaults.totalFontSizePx),
    sectionGapPx: clampTemplateNumber(settings?.sectionGapPx, 4, 24, defaults.sectionGapPx),
    logoUrl: normalizeTemplateText(settings?.logoUrl, defaults.logoUrl, 240),
    showLogo: settings?.showLogo !== false,
    logoWidthPx: clampTemplateNumber(settings?.logoWidthPx, 32, 180, defaults.logoWidthPx),
    headerAlign: normalizeTemplateAlign(settings?.headerAlign, defaults.headerAlign),
    footerAlign: normalizeTemplateAlign(settings?.footerAlign, defaults.footerAlign),
    backgroundColor: normalizeTemplateColor(settings?.backgroundColor, defaults.backgroundColor),
    textColor: normalizeTemplateColor(settings?.textColor, defaults.textColor),
    accentColor: normalizeTemplateColor(settings?.accentColor, defaults.accentColor),
    mutedColor: normalizeTemplateColor(settings?.mutedColor, defaults.mutedColor),
    borderColor: normalizeTemplateColor(settings?.borderColor, defaults.borderColor),
    borderStyle: normalizeTemplateBorderStyle(settings?.borderStyle, defaults.borderStyle),
    dividerStyle: normalizeTemplateBorderStyle(settings?.dividerStyle, defaults.dividerStyle),
    orderSlipTitle: normalizeTemplateText(settings?.orderSlipTitle, defaults.orderSlipTitle, 60),
    storeName: normalizeTemplateText(settings?.storeName, defaults.storeName, 80),
    storeAddress: normalizeTemplateText(settings?.storeAddress, defaults.storeAddress, 180),
    taxLine: normalizeTemplateText(settings?.taxLine, defaults.taxLine, 180),
    showDiscountProfileType: settings?.showDiscountProfileType !== false,
    discountProfileLabel: normalizeTemplateText(settings?.discountProfileLabel, defaults.discountProfileLabel, 80),
    footerMessage: normalizeTemplateText(settings?.footerMessage, defaults.footerMessage, 220),
    extraMessage: normalizeTemplateText(settings?.extraMessage, defaults.extraMessage, 360),
    extraMessageAlign: normalizeTemplateAlign(settings?.extraMessageAlign, defaults.extraMessageAlign),
    extraMessageStyle: normalizeTemplateBorderStyle(settings?.extraMessageStyle, defaults.extraMessageStyle),
    footerFontSizePx: clampTemplateNumber(settings?.footerFontSizePx, 10, 24, defaults.footerFontSizePx || 12),
    footerTopSpacingPx: clampTemplateNumber(settings?.footerTopSpacingPx, 0, 48, defaults.footerTopSpacingPx || 12),
    headerTopPaddingPx: clampTemplateNumber(settings?.headerTopPaddingPx, 0, 48, defaults.headerTopPaddingPx || 0),
    headerOffsetX: clampTemplateNumber(settings?.headerOffsetX, -120, 120, defaults.headerOffsetX || 0),
    headerOffsetY: clampTemplateNumber(settings?.headerOffsetY, -80, 120, defaults.headerOffsetY || 0),
    metaOffsetX: clampTemplateNumber(settings?.metaOffsetX, -120, 120, defaults.metaOffsetX || 0),
    metaOffsetY: clampTemplateNumber(settings?.metaOffsetY, -80, 120, defaults.metaOffsetY || 0),
    itemsOffsetX: clampTemplateNumber(settings?.itemsOffsetX, -120, 120, defaults.itemsOffsetX || 0),
    itemsOffsetY: clampTemplateNumber(settings?.itemsOffsetY, -80, 120, defaults.itemsOffsetY || 0),
    totalsOffsetX: clampTemplateNumber(settings?.totalsOffsetX, -120, 120, defaults.totalsOffsetX || 0),
    totalsOffsetY: clampTemplateNumber(settings?.totalsOffsetY, -80, 120, defaults.totalsOffsetY || 0),
    footerOffsetX: clampTemplateNumber(settings?.footerOffsetX, -120, 120, defaults.footerOffsetX || 0),
    footerOffsetY: clampTemplateNumber(settings?.footerOffsetY, -80, 120, defaults.footerOffsetY || 0),
    extraMessageOffsetX: clampTemplateNumber(settings?.extraMessageOffsetX, -120, 120, defaults.extraMessageOffsetX || 0),
    extraMessageOffsetY: clampTemplateNumber(settings?.extraMessageOffsetY, -80, 120, defaults.extraMessageOffsetY || 0)
  };
}

function normalizeReceiptTemplate(template = {}) {
  return {
    id: String(template?.id || DEFAULT_RECEIPT_TEMPLATE.id).trim() || DEFAULT_RECEIPT_TEMPLATE.id,
    name: normalizeTemplateName(template?.name || DEFAULT_RECEIPT_TEMPLATE.name) || DEFAULT_RECEIPT_TEMPLATE.name,
    settings: normalizeReceiptTemplateSettings(template?.settings || {}),
    isActive: Boolean(template?.isActive),
    createdAt: String(template?.createdAt || ''),
    updatedAt: String(template?.updatedAt || '')
  };
}

function getActiveReceiptTemplate() {
  return withLocalReceiptTemplateLogo(normalizeReceiptTemplate(
    state.activeReceiptTemplate
    || state.receiptTemplates.find((template) => template.isActive)
    || DEFAULT_RECEIPT_TEMPLATE
  ));
}

function getReceiptTemplateLocalLogoKey(templateId = null) {
  const safeTemplateId = String(templateId || state.receiptTemplateEditorId || RECEIPT_TEMPLATE_LOCAL_DRAFT_KEY).trim();
  return safeTemplateId || RECEIPT_TEMPLATE_LOCAL_DRAFT_KEY;
}

function readReceiptTemplateLocalLogos() {
  const stored = readUserUiState()?.receiptTemplateLocalLogos;
  return stored && typeof stored === 'object' ? stored : {};
}

function saveReceiptTemplateLocalLogos(nextMap) {
  saveUserUiState({ receiptTemplateLocalLogos: nextMap && typeof nextMap === 'object' ? nextMap : {} });
}

function getStoredReceiptTemplateLogo(templateId = null) {
  const logos = readReceiptTemplateLocalLogos();
  const key = getReceiptTemplateLocalLogoKey(templateId);
  const value = logos[key];
  return typeof value === 'string' && value.startsWith('data:image/') ? value : '';
}

function setStoredReceiptTemplateLogo(templateId, dataUrl) {
  const key = getReceiptTemplateLocalLogoKey(templateId);
  const logos = readReceiptTemplateLocalLogos();
  if (typeof dataUrl === 'string' && dataUrl.startsWith('data:image/')) {
    logos[key] = dataUrl;
  } else {
    delete logos[key];
  }
  saveReceiptTemplateLocalLogos(logos);
}

function moveStoredReceiptTemplateLogo(fromTemplateId, toTemplateId) {
  const fromKey = getReceiptTemplateLocalLogoKey(fromTemplateId);
  const toKey = getReceiptTemplateLocalLogoKey(toTemplateId);
  if (fromKey === toKey) return;
  const logos = readReceiptTemplateLocalLogos();
  const existing = logos[fromKey];
  if (!existing) return;
  logos[toKey] = existing;
  delete logos[fromKey];
  saveReceiptTemplateLocalLogos(logos);
}

function withLocalReceiptTemplateLogo(template) {
  const normalized = normalizeReceiptTemplate(template);
  const localLogo = getStoredReceiptTemplateLogo(normalized.id);
  if (!localLogo) return normalized;
  return {
    ...normalized,
    settings: {
      ...normalized.settings,
      logoUrl: localLogo
    }
  };
}

function getDiscountProfiles() {
  return normalizeDiscountProfiles(state.appConfig?.discountProfiles);
}

function getSelectedDiscountProfile() {
  const selectedId = String(state.selectedDiscountProfileId || '').trim();
  if (!selectedId) return null;
  return getDiscountProfiles().find((profile) => profile.id === selectedId) || null;
}

function ensureValidSelectedDiscountProfile() {
  const selected = getSelectedDiscountProfile();
  if (selected) return;
  state.selectedDiscountProfileId = '';
}

function formatDiscountProfileValue(profile = null) {
  const type = String(profile?.type || 'percent').trim().toLowerCase() === 'fixed' ? 'fixed' : 'percent';
  const amount = Number(profile?.amount || 0);
  if (!Number.isFinite(amount) || amount <= 0) {
    return type === 'fixed' ? money(0) : '0%';
  }
  if (type === 'fixed') {
    return `- ${money(amount)}`;
  }
  return Number.isInteger(amount) ? `${amount}%` : `${amount.toFixed(2)}%`;
}

function getDiscountProfileSummaryText(profile = null) {
  if (!profile) return 'Regular Customer (No discount)';
  return `${profile.name} (${formatDiscountProfileValue(profile)})`;
}

function normalizeInvoiceDiscountProfile(profile = null) {
  if (!profile || typeof profile !== 'object') return null;
  const normalized = normalizeDiscountProfile(profile);
  if (!normalized.name) return null;
  if (!Number.isFinite(Number(normalized.amount || 0)) || Number(normalized.amount || 0) <= 0) return null;
  return normalized;
}

function getReceiptDiscountProfileText(invoice = null) {
  const profile = normalizeInvoiceDiscountProfile(invoice?.discountProfile);
  return profile ? getDiscountProfileSummaryText(profile) : '';
}

function applyReceiptDiscountProfileLine(template, invoice, refs = {}) {
  const settings = normalizeReceiptTemplate(template).settings;
  const summaryText = getReceiptDiscountProfileText(invoice);
  const shouldShow = Boolean(settings.showDiscountProfileType && summaryText);
  const rowEl = refs.rowEl || null;
  const labelEl = refs.labelEl || null;
  const valueEl = refs.valueEl || null;
  if (rowEl) rowEl.style.display = shouldShow ? '' : 'none';
  if (labelEl) labelEl.textContent = settings.discountProfileLabel;
  if (valueEl) valueEl.textContent = summaryText;
}

function renderDiscountProfileSelect() {
  if (!discountProfileSelectEl) return;
  const profiles = getDiscountProfiles();
  const options = [
    '<option value="">Regular Customer</option>',
    ...profiles.map((profile) => `
      <option value="${escapeHtml(profile.id)}">${escapeHtml(getDiscountProfileSummaryText(profile))}</option>
    `)
  ];
  discountProfileSelectEl.innerHTML = options.join('');
  discountProfileSelectEl.value = state.selectedDiscountProfileId || '';
}

function normalizeDiscountManagerProfile(profile = {}, index = 0) {
  const normalized = normalizeDiscountProfile(profile, index);
  const usageCount = Math.max(0, Number(profile?.usageCount || 0));
  return {
    ...normalized,
    usageCount,
    lastUsedAt: profile?.lastUsedAt || null,
    canDelete: profile?.canDelete !== undefined ? Boolean(profile.canDelete) : usageCount === 0
  };
}

function syncDiscountManagerProfilesWithAppConfig() {
  const usageById = new Map(
    (state.discountManagerProfiles || []).map((profile, index) => {
      const normalized = normalizeDiscountManagerProfile(profile, index);
      return [normalized.id, normalized];
    })
  );

  state.discountManagerProfiles = getDiscountProfiles().map((profile, index) => {
    const usage = usageById.get(profile.id);
    return normalizeDiscountManagerProfile({
      ...profile,
      usageCount: usage?.usageCount || 0,
      lastUsedAt: usage?.lastUsedAt || null,
      canDelete: usage ? usage.canDelete : true
    }, index);
  });
}

function getDiscountManagerProfiles() {
  if (Array.isArray(state.discountManagerProfiles) && state.discountManagerProfiles.length) {
    return state.discountManagerProfiles.map(normalizeDiscountManagerProfile);
  }
  return getDiscountProfiles().map(normalizeDiscountManagerProfile);
}

function formatDiscountManagerValue(profile = null) {
  const amount = Number(profile?.amount || 0);
  if (String(profile?.type || '').trim().toLowerCase() === 'fixed') {
    return money(amount);
  }
  const formatted = Number.isInteger(amount)
    ? amount.toFixed(0)
    : amount.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
  return `${formatted}%`;
}

function applyDiscountManagerPayload(payload = {}) {
  if (payload?.appConfig) {
    applyAppConfig(payload.appConfig);
  }
  if (Array.isArray(payload?.profiles)) {
    state.discountManagerProfiles = payload.profiles.map(normalizeDiscountManagerProfile);
  } else {
    syncDiscountManagerProfilesWithAppConfig();
  }
  renderDiscountManager();

  if (!discountProfileModalEl?.classList.contains('open')) return;
  const activeProfile = getDiscountManagerProfiles().find((profile) => profile.id === state.discountProfileEditorId) || null;
  if (!activeProfile) {
    closeDiscountProfileModal();
    return;
  }
  populateDiscountProfileModal(activeProfile);
}

function renderDiscountManager() {
  const canEdit = canManageDiscounts();
  if (discountConfigAdminNoteEl) {
    discountConfigAdminNoteEl.textContent = canEdit
      ? 'Use the form to add discount types and click any row below to edit it. Delete stays locked once the discount is already used in transaction history.'
      : 'View-only mode. Click a discount row to review it. Current role cannot change discount types.';
  }

  if (discountProfileFormEl) {
    Array.from(discountProfileFormEl.elements || []).forEach((element) => {
      if (element instanceof HTMLInputElement || element instanceof HTMLButtonElement) {
        element.disabled = !canEdit;
      }
      if (element instanceof HTMLSelectElement) {
        element.disabled = !canEdit;
      }
    });
  }

  if (!discountProfilesListEl) return;
  const profiles = getDiscountManagerProfiles();
  discountProfilesListEl.innerHTML = profiles.length
    ? `
      <div class="discount-profile-table-wrap">
        <table class="discount-profile-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Deduction Type</th>
              <th>Value</th>
              <th>Usage</th>
              <th>Last Used</th>
            </tr>
          </thead>
          <tbody>
            ${profiles.map((profile) => `
              <tr class="discount-profile-table-row" tabindex="0" role="button" data-discount-profile-open="${escapeHtml(profile.id)}" aria-label="Open discount type ${escapeHtml(profile.name)}">
                <td>
                  <strong>${escapeHtml(profile.name)}</strong>
                </td>
                <td>${escapeHtml(profile.type === 'fixed' ? 'Minus Amount' : 'Percent')}</td>
                <td>${escapeHtml(formatDiscountManagerValue(profile))}</td>
                <td>
                  <span class="discount-profile-usage-badge ${profile.canDelete ? 'unused' : 'used'}">
                    ${profile.usageCount ? `${escapeHtml(String(profile.usageCount))} transaction(s)` : 'Unused'}
                  </span>
                </td>
                <td>${escapeHtml(profile.lastUsedAt ? formatDate(profile.lastUsedAt) : '—')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `
    : '<p>No discount profiles available yet.</p>';
}

async function refreshDiscountManager() {
  if (!discountProfilesListEl || !canAccessDiscountManager()) return;
  discountProfilesListEl.innerHTML = '<p>Loading discount profiles...</p>';

  try {
    const result = await api('/api/admin/discount-profiles', {
      headers: buildActorHeaders()
    });
    applyDiscountManagerPayload(result);
  } catch (error) {
    renderDiscountManager();
    setStatus(`Discount manager load failed: ${error.message}`);
  }
}

function scrollDiscountProfileIntoView(profileId) {
  const safeProfileId = String(profileId || '').trim();
  if (!safeProfileId || !discountProfilesListEl) return;
  const rowEl = discountProfilesListEl.querySelector(`[data-discount-profile-open="${safeProfileId}"]`);
  if (!rowEl) return;
  rowEl.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}

function updateDiscountProfileModalAmountField() {
  const isFixed = String(discountProfileModalTypeInputEl?.value || '').trim().toLowerCase() === 'fixed';
  if (discountProfileModalAmountLabelEl) {
    discountProfileModalAmountLabelEl.textContent = isFixed ? 'Amount' : 'Percent';
  }
  if (discountProfileModalAmountInputEl) {
    if (isFixed) {
      discountProfileModalAmountInputEl.removeAttribute('max');
      discountProfileModalAmountInputEl.placeholder = 'Amount';
    } else {
      discountProfileModalAmountInputEl.setAttribute('max', '100');
      discountProfileModalAmountInputEl.placeholder = 'Percent';
    }
  }
}

function populateDiscountProfileModal(profile = null) {
  if (!profile) return;
  state.discountProfileEditorId = profile.id;
  if (discountProfileModalTitleEl) {
    discountProfileModalTitleEl.textContent = `Discount Type: ${profile.name}`;
  }
  if (discountProfileModalNameInputEl) {
    discountProfileModalNameInputEl.value = profile.name;
  }
  if (discountProfileModalTypeInputEl) {
    discountProfileModalTypeInputEl.value = profile.type;
  }
  if (discountProfileModalAmountInputEl) {
    discountProfileModalAmountInputEl.value = String(profile.amount);
  }
  updateDiscountProfileModalAmountField();

  const canEdit = canManageDiscounts();
  const historyText = profile.usageCount
    ? `Used in ${profile.usageCount} saved transaction(s)${profile.lastUsedAt ? `, last used ${formatDate(profile.lastUsedAt)}` : ''}. Delete is locked for this discount type.`
    : 'No saved transaction history uses this discount type yet. You can still delete it if needed.';
  if (discountProfileModalNoteEl) {
    discountProfileModalNoteEl.textContent = canEdit
      ? historyText
      : `View-only mode. ${historyText}`;
  }

  if (discountProfileModalFormEl) {
    Array.from(discountProfileModalFormEl.elements || []).forEach((element) => {
      if (
        element instanceof HTMLInputElement
        || element instanceof HTMLButtonElement
        || element instanceof HTMLSelectElement
      ) {
        element.disabled = !canEdit;
      }
    });
  }
  if (discountProfileModalDeleteBtnEl) {
    discountProfileModalDeleteBtnEl.disabled = !canEdit || !profile.canDelete;
  }
}

function openDiscountProfileModal(profileId) {
  const safeProfileId = String(profileId || '').trim();
  if (!safeProfileId || !discountProfileModalEl) return;
  const profile = getDiscountManagerProfiles().find((row) => row.id === safeProfileId);
  if (!profile) return;

  populateDiscountProfileModal(profile);
  discountProfileModalEl.classList.add('open');
  discountProfileModalEl.setAttribute('aria-hidden', 'false');
  if (discountProfileModalNameInputEl && !discountProfileModalNameInputEl.disabled) {
    discountProfileModalNameInputEl.focus();
    discountProfileModalNameInputEl.select();
  } else {
    discountProfileModalCloseBtnEl?.focus();
  }
}

function closeDiscountProfileModal() {
  if (!discountProfileModalEl) return;
  discountProfileModalEl.classList.remove('open');
  discountProfileModalEl.setAttribute('aria-hidden', 'true');
  state.discountProfileEditorId = null;
}

async function handleDiscountProfileSubmit(event) {
  event.preventDefault();
  if (!canManageDiscounts()) {
    setStatus('Current role cannot manage discount types.');
    return;
  }
  const name = String(discountProfileNameInputEl?.value || '').trim();
  const type = String(discountProfileTypeInputEl?.value || 'percent').trim().toLowerCase() === 'fixed' ? 'fixed' : 'percent';
  const amount = Number(discountProfilePercentInputEl?.value || 0);
  if (!name) {
    setStatus('Enter a discount name.');
    return;
  }
  if (!Number.isFinite(amount) || amount < 0 || (type === 'percent' && amount > 100)) {
    setStatus(type === 'fixed'
      ? 'Enter a minus discount amount of 0 or more.'
      : 'Enter a discount percent from 0 to 100 only.');
    return;
  }
  const result = await api('/api/admin/discount-profiles', {
    method: 'POST',
    headers: buildActorHeaders(),
    body: JSON.stringify({ name, type, amount })
  });
  applyDiscountManagerPayload(result);
  if (discountProfileFormEl) discountProfileFormEl.reset();
  if (discountProfileTypeInputEl) discountProfileTypeInputEl.value = 'percent';
  const savedName = result?.profile?.name || name;
  if (getDiscountManagerProfiles().length > 5) {
    scrollDiscountProfileIntoView(result?.profile?.id || '');
  }
  setStatus(`Discount type "${savedName}" added.`);
  showConfirmationToast({
    title: 'Discount settings updated',
    message: `Discount type "${savedName}" added.`
  });
}

async function handleDiscountProfileListClick(event) {
  const rowEl = event.target.closest('[data-discount-profile-open]');
  if (!rowEl) return;
  openDiscountProfileModal(rowEl.getAttribute('data-discount-profile-open'));
}

function handleDiscountProfileListKeydown(event) {
  const rowEl = event.target.closest('[data-discount-profile-open]');
  if (!rowEl) return;
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  openDiscountProfileModal(rowEl.getAttribute('data-discount-profile-open'));
}

async function handleDiscountProfileModalSubmit(event) {
  event.preventDefault();
  if (!canManageDiscounts()) {
    setStatus('Current role cannot manage discount types.');
    return;
  }

  const profileId = String(state.discountProfileEditorId || '').trim();
  if (!profileId) {
    setStatus('Select a discount type first.');
    return;
  }

  const name = String(discountProfileModalNameInputEl?.value || '').trim();
  const type = String(discountProfileModalTypeInputEl?.value || 'percent').trim().toLowerCase() === 'fixed' ? 'fixed' : 'percent';
  const amount = Number(discountProfileModalAmountInputEl?.value || 0);
  if (!name) {
    setStatus('Discount name cannot be empty.');
    return;
  }
  if (!Number.isFinite(amount) || amount < 0 || (type === 'percent' && amount > 100)) {
    setStatus(type === 'fixed'
      ? 'Minus discount amount must be 0 or more.'
      : 'Discount percent must be between 0 and 100.');
    return;
  }

  const result = await api(`/api/admin/discount-profiles/${encodeURIComponent(profileId)}`, {
    method: 'PUT',
    headers: buildActorHeaders(),
    body: JSON.stringify({ name, type, amount })
  });
  applyDiscountManagerPayload(result);
  closeDiscountProfileModal();
  const savedName = result?.profile?.name || name;
  setStatus(`Discount type "${savedName}" updated.`);
  showConfirmationToast({
    title: 'Discount settings updated',
    message: `Discount type "${savedName}" updated.`
  });
}

async function handleDiscountProfileModalDelete() {
  if (!canManageDiscounts()) {
    setStatus('Current role cannot manage discount types.');
    return;
  }

  const profileId = String(state.discountProfileEditorId || '').trim();
  if (!profileId) {
    setStatus('Select a discount type first.');
    return;
  }

  const profile = getDiscountManagerProfiles().find((row) => row.id === profileId);
  if (!profile) {
    setStatus('Discount type not found.');
    return;
  }
  if (!profile.canDelete) {
    setStatus('This discount type cannot be deleted because it is already used in transaction history.');
    return;
  }

  const confirmed = window.confirm(`Delete discount type "${profile.name}"?`);
  if (!confirmed) return;

  const result = await api(`/api/admin/discount-profiles/${encodeURIComponent(profileId)}`, {
    method: 'DELETE',
    headers: buildActorHeaders()
  });
  applyDiscountManagerPayload(result);
  closeDiscountProfileModal();
  setStatus(`Discount type "${profile.name}" deleted.`);
  showConfirmationToast({
    title: 'Discount settings updated',
    message: `Discount type "${profile.name}" deleted.`
  });
}

function getEditableRoleAccessRoles() {
  return ['encharge', 'supervisor'];
}

function getRoleAccessEntriesForRole(role) {
  const safeRole = normalizeRoleChoice(role);
  return Array.isArray(ROLE_ACCESS_SUMMARY?.[safeRole]) ? ROLE_ACCESS_SUMMARY[safeRole] : [];
}

function getRoleAccessCatalogEntry(permissionKey) {
  const safePermissionKey = String(permissionKey || '').trim().toLowerCase();
  return ROLE_ACCESS_CATALOG.find((entry) => entry.key === safePermissionKey) || null;
}

function renderRoleAccessManager() {
  if (!roleAccessListEl) return;
  const roleCards = getEditableRoleAccessRoles().map((roleKey) => {
    const activeKeys = getRoleAccessEntriesForRole(roleKey);
    const chipsMarkup = activeKeys.length
      ? activeKeys.map((permissionKey) => {
        const entry = getRoleAccessCatalogEntry(permissionKey);
        if (!entry) return '';
        return `
          <li class="role-access-chip">
            <div class="role-access-chip-copy">
              <strong>${escapeHtml(entry.label)}</strong>
              <small>${escapeHtml(entry.description)}</small>
            </div>
          </li>
        `;
      }).join('')
      : '<li class="role-access-empty">No built-in functions listed for this role.</li>';

    return `
      <article class="role-access-card ${escapeHtml(roleKey)}">
        <div class="role-access-card-head">
          <div>
            <span class="role-access-eyebrow">${escapeHtml(formatRoleLabel(roleKey))}</span>
            <h4>${escapeHtml(formatRoleLabel(roleKey))} Functions</h4>
            <p>${activeKeys.length} built-in function(s) available for this role.</p>
          </div>
          <span class="role-access-count">${activeKeys.length}</span>
        </div>
        <ul class="role-access-list">${chipsMarkup}</ul>
        <p class="role-access-view-note">Reference only. This list shows the built-in functions currently available for this role.</p>
      </article>
    `;
  }).join('');

  roleAccessListEl.innerHTML = `
    <div class="role-access-grid">
      ${roleCards}
    </div>
  `;
}

async function updateRoleAccessConfig(roleKey, updater) {
  if (!canManageUsers()) {
    setStatus('Current role cannot update role access.');
    return;
  }
  const safeRole = normalizeRoleChoice(roleKey);
  if (!getEditableRoleAccessRoles().includes(safeRole)) return;

  const currentAccess = getRoleAccessConfig();
  const nextEntries = normalizeRoleAccessEntries(
    typeof updater === 'function' ? updater(currentAccess[safeRole] || []) : updater,
    []
  );

  const result = await api('/api/admin/role-access', {
    method: 'PUT',
    headers: buildActorHeaders(),
    body: JSON.stringify({
      roleAccess: {
        ...currentAccess,
        [safeRole]: nextEntries
      }
    })
  });
  applyAppConfig(result?.appConfig || state.appConfig);
  renderRoleAccessManager();
  await refreshAdminUsers();
  setStatus(`${formatRoleLabel(safeRole)} access updated.`);
}

function canAccessAdminPanel(panelName) {
  const normalizedPanel = normalizeAdminPanelName(panelName);
  if (normalizedPanel === 'overview') return canAccessAdminFeatures();
  if (normalizedPanel === 'inventory') return canAccessInventoryPanel();
  if (normalizedPanel === 'kit-spec') return canAccessKitSpecPanel();
  if (normalizedPanel === 'users') return canViewUserDirectory();
  if (normalizedPanel === 'operations') return canAccessOperationsPanel();
  if (normalizedPanel === 'receipt-templates') return canAccessReceiptTemplatesPanel();
  if (normalizedPanel === 'reports') return canAccessReportsPanel();
  if (normalizedPanel === 'others') return canAccessDiscountManager() || canAccessMonthlyClosing();
  return false;
}

function getFirstAccessibleAdminPanel(preferredPanel = readUserUiState()?.adminPanel) {
  const preferred = normalizeAdminPanelName(preferredPanel);
  if (canAccessAdminPanel(preferred)) return preferred;
  const orderedPanels = getCurrentAdminNavOrder();
  return orderedPanels.find((panelName) => canAccessAdminPanel(panelName)) || 'overview';
}

function updateAdminNavVisibility() {
  ADMIN_NAV_ENTRIES.forEach(({ panelName, button }) => {
    if (!(button instanceof HTMLElement)) return;
    button.hidden = !canAccessAdminPanel(panelName);
  });
}

function applyAppConfig(config = {}) {
  state.appConfig = normalizeAppConfig(config?.appConfig || config);
  syncDiscountManagerProfilesWithAppConfig();
  ensureValidSelectedDiscountProfile();
  renderDiscountProfileSelect();
  renderDiscountManager();
  renderRoleAccessManager();
  renderKitSpecModeControl();
  updateSettingsRoleItems();
  updateShiftMonitorVisibility();
  updateAdminNavVisibility();
  if (document.body.classList.contains('admin-open')) {
    if (canAccessAdminFeatures()) {
      switchAdminPanel(getFirstAccessibleAdminPanel(readUserUiState()?.adminPanel), { persist: false });
    } else {
      closeAdminDashboard();
    }
  }
  renderCart();
}

function canManageUsers() {
  return isAdminRole();
}

function canManageReceiptTemplates() {
  return isAdminRole();
}

function canManageCashDrawer() {
  return isAdminRole();
}

function buildActorHeaders() {
  return {
    'x-user-role': String(activeAuthSession?.role || ''),
    'x-user-id': String(activeAuthSession?.userId || ''),
    'x-user-email': String(activeAuthSession?.email || '')
  };
}

function getAdminRangeQueryValue() {
  const range = String(adminRangeEl?.value || '').trim().toLowerCase();
  if (range === 'daily' || range === 'weekly') return range;
  return '';
}

function getMonthRangeBounds(monthValue) {
  const normalized = String(monthValue || '').trim();
  if (!/^\d{4}-\d{2}$/.test(normalized)) return null;
  const [yearValue, monthValueRaw] = normalized.split('-');
  const year = Number(yearValue);
  const month = Number(monthValueRaw) - 1;
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 0 || month > 11) return null;
  const from = new Date(year, month, 1, 0, 0, 0, 0);
  const to = new Date(year, month + 1, 0, 23, 59, 59, 999);
  return {
    dateFrom: from.toISOString(),
    dateTo: to.toISOString()
  };
}

function normalizeSalesOpsRange(range) {
  const normalized = String(range || '').trim().toLowerCase();
  if (normalized === 'weekly' || normalized === 'monthly' || normalized === 'custom_month' || normalized === 'all') return normalized;
  return 'daily';
}

function getSalesOpsRangeQueryValue() {
  return normalizeSalesOpsRange(salesOpsRangeEl?.value || activeSalesOpsRange);
}

function getSalesOpsSelectedMonth() {
  return String(salesOpsMonthPickerEl?.value || getCurrentMonthValue()).trim();
}

function syncSalesOpsMonthPickerVisibility(range = activeSalesOpsRange) {
  if (!salesOpsMonthPickerEl) return;
  const normalizedRange = normalizeSalesOpsRange(range);
  if (normalizedRange === 'custom_month') {
    salesOpsMonthPickerEl.style.display = 'inline-block';
    if (!salesOpsMonthPickerEl.value) {
      salesOpsMonthPickerEl.value = getCurrentMonthValue();
    }
    return;
  }
  salesOpsMonthPickerEl.style.display = 'none';
}

function normalizeSalesOpsWeekdayView(view) {
  const normalized = String(view || '').trim().toLowerCase();
  if (normalized === 'line' || normalized === 'both' || normalized === 'unit') return normalized;
  return 'bar';
}

function normalizeSalesOpsHourlyView(view) {
  const normalized = String(view || '').trim().toLowerCase();
  if (normalized === 'line' || normalized === 'both') return normalized;
  return 'bar';
}

function renderSalesOpsHourlyTrendChart(hourlyRows = []) {
  const canvas = document.getElementById('salesOpsHourlyChart');
  destroySalesOpsHourlyChart();
  if (!canvas || !window.Chart || !hourlyRows.length) return;

  const isLineView = activeSalesOpsHourlyView === 'line';
  const isBothView = activeSalesOpsHourlyView === 'both';
  const usesLineOnlyView = isLineView && !isBothView;
  const selectedHourlyIndex = activeSalesOpsSelection?.source === 'hourly'
    ? activeSalesOpsSelection.index
    : -1;

  const datasets = [{
    type: isLineView ? 'line' : 'bar',
    label: 'Sales',
    data: hourlyRows.map((row) => Number(row?.totalSales || 0)),
    backgroundColor(context) {
      if (context?.dataIndex === selectedHourlyIndex) {
        if (usesLineOnlyView) return 'rgba(255, 113, 113, 0.24)';
        return '#ff8c66';
      }
      if (usesLineOnlyView) return 'rgba(67, 194, 126, 0.18)';
      const chart = context.chart;
      const { chartArea } = chart || {};
      if (!chartArea) return '#43c27e';
      const gradient = chart.ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
      gradient.addColorStop(0, '#7ce2a8');
      gradient.addColorStop(1, '#43c27e');
      return gradient;
    },
    borderColor(context) {
      if (context?.dataIndex === selectedHourlyIndex) {
        return '#d04b2f';
      }
      return '#2c9f62';
    },
    borderWidth: usesLineOnlyView ? 3 : 1,
    borderSkipped: false,
    borderRadius: usesLineOnlyView ? 0 : {
      topLeft: 10,
      topRight: 10,
      bottomLeft: 0,
      bottomRight: 0
    },
    hoverBackgroundColor: usesLineOnlyView ? 'rgba(67, 194, 126, 0.24)' : '#58cf8e',
    hoverBorderColor: '#248553',
    barPercentage: 0.8,
    categoryPercentage: 0.9,
    maxBarThickness: 26,
    tension: usesLineOnlyView ? 0.24 : 0,
    fill: usesLineOnlyView,
    pointRadius(context) {
      if (!usesLineOnlyView) return 0;
      return context?.dataIndex === selectedHourlyIndex ? 6 : 4;
    },
    pointHoverRadius: usesLineOnlyView ? 6 : 0,
    pointBackgroundColor(context) {
      return context?.dataIndex === selectedHourlyIndex ? '#ff8c66' : '#43c27e';
    },
    pointBorderColor: '#ffffff',
    pointBorderWidth: usesLineOnlyView ? 2 : 0,
    pointHitRadius: 16
  }];

  if (isBothView) {
    datasets.push({
      type: 'line',
      label: 'Sales Trend',
      data: hourlyRows.map((row) => Number(row?.totalSales || 0)),
      borderColor: '#2c9f62',
      backgroundColor: 'rgba(67, 194, 126, 0.14)',
      borderWidth: 3,
      tension: 0.24,
      fill: false,
      pointRadius(context) {
        return context?.dataIndex === selectedHourlyIndex ? 6 : 4;
      },
      pointHoverRadius: 6,
      pointBackgroundColor(context) {
        return context?.dataIndex === selectedHourlyIndex ? '#ff8c66' : '#43c27e';
      },
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointHitRadius: 16
    });
  }

  salesOpsHourlyChart = new window.Chart(canvas.getContext('2d'), {
    type: isLineView ? 'line' : 'bar',
    data: {
      labels: hourlyRows.map((row) => String(row?.label || '--')),
      datasets
    },
    options: {
      indexAxis: 'x',
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      onClick(_event, elements) {
        if (!latestSalesOpsDashboard) return;
        if (!elements?.length) {
          setActiveSalesOpsSelection(null);
          renderSalesOpsDashboard(latestSalesOpsDashboard);
          return;
        }
        const nextIndex = Number(elements[0]?.index);
        if (!Number.isInteger(nextIndex) || nextIndex < 0) return;
        const isSameSelection = activeSalesOpsSelection?.source === 'hourly' && activeSalesOpsSelection?.index === nextIndex;
        setActiveSalesOpsSelection(isSameSelection ? null : { source: 'hourly', index: nextIndex });
        renderSalesOpsDashboard(latestSalesOpsDashboard);
      },
      animation: {
        duration: 280
      },
      layout: {
        padding: {
          top: 8,
          right: 10,
          bottom: 0,
          left: 4
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          displayColors: false,
          backgroundColor: 'rgba(42, 31, 24, 0.96)',
          titleColor: '#fffaf5',
          bodyColor: '#fffaf5',
          padding: 12,
          cornerRadius: 10,
          titleFont: {
            size: 12,
            weight: '700'
          },
          bodyFont: {
            size: 11,
            weight: '600'
          },
          callbacks: {
            title(items) {
              const row = hourlyRows[items?.[0]?.dataIndex] || {};
              return `Hour: ${String(row?.label || '--')}`;
            },
            label(context) {
              return `Sales: ${money(context.parsed?.y || 0)}`;
            },
            afterLabel(context) {
              const row = hourlyRows[context?.dataIndex] || {};
              return `Transactions: ${Number(row?.transactions || 0)}`;
            }
          }
        },
        salesOpsWeekdayHoverLine: {
          color: '#ff4d4d'
        }
      },
      scales: {
        x: {
          beginAtZero: false,
          grid: {
            display: false,
            drawBorder: false
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 12,
            color: '#4a2d1d',
            font: {
              size: 11,
              weight: '800'
            },
            padding: 12,
            maxRotation: 0,
            minRotation: 0,
            callback(value) {
              return String(this.getLabelForValue(value));
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(88, 88, 88, 0.12)',
            drawBorder: false
          },
          ticks: {
            color: '#6d5a4d',
            font: {
              size: 11,
              weight: '700'
            },
            callback(value) {
              return formatCompactNumber(value);
            }
          }
        }
      }
    },
    plugins: [salesOpsWeekdayHoverLinePlugin]
  });
}

function getCashierInvoiceContext() {
  if (!activeAuthSession?.email) return {};
  return {
    cashierUserId: activeAuthSession.userId || null,
    cashierEmail: normalizeEmail(activeAuthSession.email),
    cashierName: String(activeAuthSession.name || '').trim() || activeAuthSession.email,
    cashierRole: normalizeRoleChoice(activeAuthSession.role)
  };
}

function updateSettingsRoleItems() {
  if (settingsAdminDashboardBtn) {
    settingsAdminDashboardBtn.style.display = canAccessAdminFeatures() ? 'block' : 'none';
  }
  if (settingsEditMenuBtn) {
    settingsEditMenuBtn.style.display = canAccessMenuEditor() ? 'block' : 'none';
  }
  if (settingsCashDrawerBtn) {
    settingsCashDrawerBtn.style.display = canAccessCashDrawerControl() ? 'block' : 'none';
  }
}

function fireAudit(eventType, metadata = {}) {
  if (!activeAuthSession?.email) return;
  api('/api/auth/audit', {
    method: 'POST',
    body: JSON.stringify({
      eventType,
      userId: activeAuthSession.userId || null,
      email: activeAuthSession.email,
      metadata
    })
  }).catch(() => {});
}

function showConfirmationToast({ title, message, tone = 'success', duration = 2600 }) {
  if (!globalToastEl) return;
  if (globalToastTitleEl) globalToastTitleEl.textContent = title || 'Success';
  if (globalToastMessageEl) globalToastMessageEl.textContent = message || '';
  globalToastEl.classList.remove('success');
  globalToastEl.classList.add(tone);
  globalToastEl.setAttribute('aria-hidden', 'false');
  globalToastEl.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    globalToastEl.classList.remove('show');
    globalToastEl.setAttribute('aria-hidden', 'true');
  }, duration);
}

function updateWelcomeBanner() {
  if (!welcomeBannerEl) return;
  const rawName = String(activeAuthSession?.name || '').trim();
  const firstName = rawName ? rawName.split(/\s+/)[0] : 'User';
  const role = String(activeAuthSession?.role || 'encharge').toLowerCase();
  const roleIconMap = {
    administrations: '/User Role/administrator.png',
    supervisor: '/User Role/Supervisor.png',
    encharge: '/User Role/Encharge.png'
  };
  if (welcomeRoleIconEl) {
    welcomeRoleIconEl.src = roleIconMap[role] || roleIconMap.encharge;
    welcomeRoleIconEl.alt = `${role} role icon`;
  }
  if (welcomeTextEl) {
    welcomeTextEl.textContent = `Welcome ${firstName}, have a nice day.`;
    updateSettingsRoleItems();
    updateShiftMonitorVisibility();
    return;
  }
  welcomeBannerEl.textContent = `Welcome ${firstName}, have a nice day.`;
  updateSettingsRoleItems();
  updateShiftMonitorVisibility();
}

function updatePhilippineDateTime() {
  if (!phDateTimeEl) return;
  const now = new Date();
  const dateText = new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(now);
  const timeText = new Intl.DateTimeFormat('en-PH', {
    timeZone: 'Asia/Manila',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(now);
  phDateTimeEl.textContent = `${dateText} | ${timeText} (Philippines)`;
}

function startPhilippineClock() {
  updatePhilippineDateTime();
  if (phClockInterval) return;
  phClockInterval = setInterval(updatePhilippineDateTime, 1000);
}

function closeSettingsMenu() {
  if (!settingsMenuEl) return;
  settingsMenuEl.classList.remove('open');
  settingsMenuEl.setAttribute('aria-hidden', 'true');
  if (settingsToggleBtn) settingsToggleBtn.setAttribute('aria-expanded', 'false');
}

function toggleSettingsMenu() {
  if (!settingsMenuEl) return;
  const willOpen = !settingsMenuEl.classList.contains('open');
  settingsMenuEl.classList.toggle('open', willOpen);
  settingsMenuEl.setAttribute('aria-hidden', String(!willOpen));
  if (settingsToggleBtn) settingsToggleBtn.setAttribute('aria-expanded', String(willOpen));
}

function openCashDrawerControlModal() {
  if (!cashDrawerControlModalEl) return;
  if (!canAccessCashDrawerControl()) {
    setStatus('Current role does not have cash drawer control access.');
    return;
  }
  cashDrawerControlModalEl.classList.add('open');
  cashDrawerControlModalEl.setAttribute('aria-hidden', 'false');
  refreshCashDrawerAdmin().catch((error) => {
    if (cashDrawerSummaryEl) cashDrawerSummaryEl.textContent = `Cash drawer error: ${error.message}`;
  });
}

function closeCashDrawerControlModal() {
  if (!cashDrawerControlModalEl) return;
  cashDrawerControlModalEl.classList.remove('open');
  cashDrawerControlModalEl.setAttribute('aria-hidden', 'true');
}

function updateCashoutDiscrepancyStatus(summary) {
  if (!cashoutDiscrepancyStatusEl) return;
  if (!summary) {
    cashoutDiscrepancyStatusEl.textContent = 'Loading summary...';
    return;
  }
  const endingCash = parseCashoutEndingCash();
  if (endingCash === null) {
    cashoutDiscrepancyStatusEl.textContent = 'Enter ending cash to compute discrepancy.';
    return;
  }
  const expectedCash = Number(summary?.expectedCashBalance || 0);
  const discrepancy = endingCash - expectedCash;
  const note = discrepancy === 0
    ? 'Balanced. Ending cash matches expected.'
    : discrepancy > 0
      ? `Overage detected: ${money(discrepancy)}`
      : `Shortage detected: ${money(Math.abs(discrepancy))}`;
  cashoutDiscrepancyStatusEl.textContent = note;
}

function parseCashoutEndingCash({ requireValue = false } = {}) {
  if (!cashoutEndingCashInputEl) return null;
  const rawValue = String(cashoutEndingCashInputEl.value || '').trim();
  if (!rawValue) {
    cashoutEndingCashInputEl.setCustomValidity(requireValue ? 'Enter the counted ending cash before signing out.' : '');
    return null;
  }

  const endingCash = parseNonNegativeAmount(rawValue);
  if (endingCash === null) {
    cashoutEndingCashInputEl.setCustomValidity(requireValue ? 'Enter a valid ending cash amount that is 0 or higher.' : '');
    return null;
  }

  cashoutEndingCashInputEl.setCustomValidity('');
  return endingCash;
}

async function openCashoutFlow() {
  if (!cashoutSummaryEl) return;
  openCashoutSummaryModal();
  cashoutSummaryEl.innerHTML = '<p>Loading summary...</p>';
  if (cashoutEndingCashInputEl) cashoutEndingCashInputEl.value = '';
  if (cashoutDiscrepancyStatusEl) {
    cashoutDiscrepancyStatusEl.textContent = 'Enter ending cash to compute discrepancy.';
  }

  try {
    const summary = await refreshLatestShiftSummary();
    renderShiftSummary(cashoutSummaryEl, summary);
    if (cashoutEndingCashInputEl) cashoutEndingCashInputEl.setCustomValidity('');
    updateCashoutDiscrepancyStatus(summary);
  } catch (error) {
    cashoutSummaryEl.innerHTML = `<p class="error">Unable to load shift summary: ${escapeHtml(error.message)}</p>`;
  }
}

async function submitStartShift() {
  if (state.startShiftBusy || !needsCashierShiftStart()) return;

  const drawerId = String(startShiftContext?.drawerId || startShiftDrawerSelectEl?.value || '').trim();
  if (!drawerId) {
    if (startShiftReferenceStatusEl) {
      startShiftReferenceStatusEl.textContent = 'Select a drawer name before starting the shift.';
    }
    if (startShiftDrawerSelectEl) startShiftDrawerSelectEl.focus();
    return;
  }
  const startingCash = parseNonNegativeAmount(startShiftCashInputEl?.value);
  if (startingCash === null) {
    if (startShiftAdjustmentStatusEl) {
      startShiftAdjustmentStatusEl.textContent = 'Enter the counted cash drawer amount to start the shift.';
    }
    if (startShiftCashInputEl) startShiftCashInputEl.focus();
    return;
  }

  const previousDrawerBalance = parseNonNegativeAmount(startShiftContext?.previousDrawerBalance);
  const rawAdjustment = String(startShiftAdjustmentInputEl?.value || '').trim();
  let openingAdjustment = 0;
  if (rawAdjustment) {
    openingAdjustment = Math.round(Number(rawAdjustment) * 100) / 100;
    if (!Number.isFinite(openingAdjustment)) {
      if (startShiftAdjustmentStatusEl) {
        startShiftAdjustmentStatusEl.textContent = 'Cash adjustment must be a valid number before you start the shift.';
      }
      if (startShiftAdjustmentInputEl) startShiftAdjustmentInputEl.focus();
      return;
    }
  }
  if (previousDrawerBalance !== null) {
    const expectedStartingCash = Math.round((previousDrawerBalance + openingAdjustment) * 100) / 100;
    if (expectedStartingCash < 0) {
      if (startShiftAdjustmentStatusEl) {
        startShiftAdjustmentStatusEl.textContent = 'The previous balance plus adjustment cannot be negative.';
      }
      if (startShiftAdjustmentInputEl) startShiftAdjustmentInputEl.focus();
      return;
    }
    if (startingCash !== expectedStartingCash) {
      if (startShiftAdjustmentStatusEl) {
        startShiftAdjustmentStatusEl.textContent = rawAdjustment
          ? 'Click "Apply Adjustment" so the cash amount matches the adjustment before starting the shift.'
          : 'Use "Use Previous Balance" or "Apply Adjustment" before starting the shift.';
      }
      return;
    }
  }

  try {
    state.startShiftBusy = true;
    if (startShiftConfirmBtn) {
      startShiftConfirmBtn.disabled = true;
      startShiftConfirmBtn.textContent = 'Starting...';
    }
    const shift = await ensureCashierShiftStarted({
      drawerId,
      startingCash,
      previousShiftId: startShiftContext?.previousShiftId || null,
      previousDrawerBalance,
      openingAdjustment
    });
    const recordedStartingCash = Number(shift?.startingCash ?? startingCash);
    const recordedAdjustment = Number(shift?.openingAdjustment ?? openingAdjustment ?? 0);
    closeStartShiftModal();
    setStatus(`Shift started. Starting cash recorded at ${money(recordedStartingCash)}.`);
    showConfirmationToast({
      title: 'Shift started',
      message: recordedStartingCash !== startingCash
        ? `An existing active shift was resumed with starting cash ${money(recordedStartingCash)}.`
        : recordedAdjustment === 0
          ? `Starting cash verified at ${money(recordedStartingCash)}.`
          : `Starting cash set to ${money(recordedStartingCash)} with an applied cash adjustment of ${money(Math.abs(recordedAdjustment))}.`,
      tone: 'success'
    });
  } catch (error) {
    if (isNetworkLikeError(error)) {
      persistCashierShiftState({
        shiftId: null,
        drawerId,
        drawerName: String(startShiftContext?.drawerName || '').trim() || null,
        startedAt: new Date().toISOString(),
        startingCash,
        previousDrawerBalance,
        openingAdjustment
      });
      closeStartShiftModal();
      setStatus(`Shift started in offline mode. Starting cash recorded at ${money(startingCash)}.`);
      showConfirmationToast({
        title: 'Offline shift started',
        message: 'The shift was stored locally and will sync when the server is reachable.',
        tone: 'warning',
        duration: 3200
      });
      return;
    }

    if (startShiftReferenceStatusEl) {
      startShiftReferenceStatusEl.textContent = `Unable to start shift: ${error.message}`;
    }
    if (startShiftAdjustmentStatusEl) {
      startShiftAdjustmentStatusEl.textContent = 'Fix the issue above, then try starting the shift again.';
    }
  } finally {
    state.startShiftBusy = false;
    if (startShiftConfirmBtn) {
      startShiftConfirmBtn.disabled = false;
      startShiftConfirmBtn.textContent = 'Start Shift';
    }
  }
}

async function finalizeLogout() {
  if (state.logoutBusy) return;
  state.logoutBusy = true;

  const displayName = String(activeAuthSession?.name || 'User').trim() || 'User';
  const logoutPayload = {
    userId: activeAuthSession?.userId || null,
    email: activeAuthSession?.email || null
  };

  try {
    if (state.poller) {
      clearInterval(state.poller);
      state.poller = null;
    }

    closeSettingsMenu();
    closeAdminDashboard();
    closeAdminReceiptModal();
    closeEwalletModal();
    closeShiftMonitorModal();
    closeStartShiftModal();
    closeCashoutSummaryModal();
    closeInventoryEditModal();
    closeInventoryDeleteModal();
    closeInventoryHistoryModal();
    closeCashDrawerControlModal();
    setLatestAdminReport(null);

    if (isDrawerOperatorRole(activeAuthSession?.role)) {
      clearCashierShiftState();
    }

    clearActiveSession();
    lockDashboard();
    setAuthMode('login');
    showConfirmationToast({
      title: 'Logged out successfully',
      message: `See you next time, ${displayName}.`,
      tone: 'success'
    });
    if (loginEmailEl) loginEmailEl.focus();

    api('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify(logoutPayload)
    }).catch(() => {});
  } finally {
    state.logoutBusy = false;
  }
}

async function handleLogout() {
  if (state.logoutBusy) return;
  if (isDrawerOperatorRole(activeAuthSession?.role) && cashierShiftState?.startedAt) {
    await openCashoutFlow();
    return;
  }
  await finalizeLogout();
}

function setAuthMessage(message, isSuccess = false) {
  if (!authMessageEl) return;
  authMessageEl.textContent = message || '';
  authMessageEl.classList.toggle('success', Boolean(isSuccess));
}

function setAuthMode(mode) {
  const showLogin = mode !== 'hidden';
  if (loginFormEl) loginFormEl.classList.toggle('hidden', !showLogin);
  setAuthMessage('');
  updateSettingsRoleItems();
}

function unlockDashboard() {
  document.body.classList.remove('auth-locked');
  if (authGateEl) authGateEl.setAttribute('aria-hidden', 'true');
  updateWelcomeBanner();
}

function lockDashboard() {
  document.body.classList.add('auth-locked');
  if (authGateEl) authGateEl.setAttribute('aria-hidden', 'false');
}

function startAppOnce() {
  if (appInitialized) return;
  appInitialized = true;
  init().catch((error) => {
    setStatus(`Startup error: ${error.message}`);
  });
}

function waitForNextPaint() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {
      resolve();
      return;
    }
    window.requestAnimationFrame(() => resolve());
  });
}

function setFormSubmitBusy(formEl, busy, busyText = 'Please wait...') {
  if (!formEl) return;
  const submitBtn = formEl.querySelector('button[type="submit"]');
  if (!submitBtn) return;

  if (busy) {
    if (!submitBtn.dataset.originalText) {
      submitBtn.dataset.originalText = submitBtn.textContent || 'Submit';
    }
    submitBtn.disabled = true;
    submitBtn.textContent = busyText;
    return;
  }

  submitBtn.disabled = false;
  submitBtn.textContent = submitBtn.dataset.originalText || submitBtn.textContent;
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  if (state.authBusy) return;
  const email = normalizeEmail(loginEmailEl?.value);
  const password = String(loginPasswordEl?.value || '');

  if (!email || !password) {
    setAuthMessage('Complete email and password to sign in.');
    return;
  }

  try {
    state.authBusy = true;
    setFormSubmitBusy(loginFormEl, true, 'Signing in...');
    const result = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    const accountRole = normalizeRoleChoice(result?.user?.role);
    const sessionUser = {
      name: result.user.fullName,
      email: result.user.email,
      role: result.user.role,
      userId: result.user.id
    };

    writeActiveSession(sessionUser);
    writeAccessToken(result.session?.accessToken || '');
    clearCashierShiftState();
    setAuthMessage('');
    unlockDashboard();
    startAppOnce();
    showConfirmationToast({
      title: 'Login successful',
      message: `Welcome ${result.user.fullName}. Have a nice day.`,
      tone: 'success'
    });
    cacheOfflineAuthCredential({
      name: sessionUser.name,
      email: sessionUser.email,
      role: sessionUser.role,
      userId: sessionUser.userId,
      password
    }).catch(() => {});
    if (canViewShiftMonitorOnPos(accountRole)) {
      await waitForNextPaint();
      await presentStartShiftModal();
    }
  } catch (error) {
    const errorText = String(error?.message || '');
    const isNetworkLike = /fetch|network|offline|failed to fetch/i.test(errorText);
    if (isNetworkLike) {
      try {
        const offlineUser = await tryOfflineLogin(email, password);
        if (offlineUser) {
          const offlineRole = normalizeRoleChoice(offlineUser.role);

          writeActiveSession(offlineUser);
          writeAccessToken('');
          clearCashierShiftState();
          setAuthMessage('Offline login successful (cached credentials).', true);
          showConfirmationToast({
            title: 'Offline login',
            message: `Welcome back ${offlineUser.name}.`,
            tone: 'warning',
            duration: 2800
          });
          unlockDashboard();
          startAppOnce();
          if (canViewShiftMonitorOnPos(offlineRole)) {
            await presentStartShiftModal();
          }
          return;
        }
      } catch (_offlineError) {
        // Fall through to regular error message.
      }
    }

    clearActiveSession();
    setAuthMessage(`Login failed: ${error.message}`);
  } finally {
    state.authBusy = false;
    setFormSubmitBusy(loginFormEl, false);
  }
}

function setupAuth() {
  if (loginFormEl) {
    loginFormEl.addEventListener('submit', handleLoginSubmit);
  }
  if (cashoutEndingCashInputEl) {
    cashoutEndingCashInputEl.addEventListener('input', () => {
      parseCashoutEndingCash();
      updateCashoutDiscrepancyStatus(latestShiftSummary);
      if (cashoutSummaryEl && latestShiftSummary) {
        renderShiftSummary(cashoutSummaryEl, latestShiftSummary, {
          endingCash: parseCashoutEndingCash()
        });
      }
    });
  }
  if (settingsToggleBtn) {
    settingsToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSettingsMenu();
    });
  }
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
  if (startShiftCashInputEl) {
    startShiftCashInputEl.addEventListener('input', updateStartShiftAdjustmentStatus);
  }
  if (startShiftDrawerSelectEl) {
    startShiftDrawerSelectEl.addEventListener('change', () => {
      loadSelectedStartShiftDrawerContext().catch((error) => {
        if (startShiftReferenceStatusEl) {
          startShiftReferenceStatusEl.textContent = `Unable to load drawer context: ${error.message}`;
        }
      });
    });
  }
  if (startShiftAdjustmentInputEl) {
    startShiftAdjustmentInputEl.addEventListener('input', updateStartShiftAdjustmentStatus);
  }
  if (startShiftUsePreviousBtn) {
    startShiftUsePreviousBtn.addEventListener('click', usePreviousStartShiftBalance);
  }
  if (startShiftApplyAdjustmentBtn) {
    startShiftApplyAdjustmentBtn.addEventListener('click', applyStartShiftAdjustment);
  }
  if (startShiftConfirmBtn) {
    startShiftConfirmBtn.addEventListener('click', () => {
      submitStartShift().catch((error) => {
        setStatus(`Shift start error: ${error.message}`);
      });
    });
  }
  if (startShiftSignOutBtn) {
    startShiftSignOutBtn.addEventListener('click', () => {
      finalizeLogout().catch(() => {});
    });
  }
  if (settingsAdminDashboardBtn) {
    settingsAdminDashboardBtn.addEventListener('click', async () => {
      closeSettingsMenu();
      await openAdminDashboard();
    });
  }
  if (settingsEditMenuBtn) {
    settingsEditMenuBtn.addEventListener('click', () => {
      closeSettingsMenu();
      openMenuEditor();
      if (!menuEditorWarmReady) {
        warmMenuEditorInBackground({ force: true });
      } else {
        refreshMenuEditorData().catch((error) => {
          setStatus(`Edit menu refresh failed: ${error.message}`);
        });
      }
    });
  }
  if (settingsCashDrawerBtn) {
    settingsCashDrawerBtn.addEventListener('click', () => {
      closeSettingsMenu();
      openCashDrawerControlModal();
    });
  }
  if (cashDrawerControlCloseBtnEl) {
    cashDrawerControlCloseBtnEl.addEventListener('click', closeCashDrawerControlModal);
  }
  document.addEventListener('click', (e) => {
    if (!settingsMenuEl?.classList.contains('open')) return;
    if (e.target?.closest('.settings-menu-wrap')) return;
    closeSettingsMenu();
  });
  document.addEventListener('click', (e) => {
    if (adminNavContextMenuEl?.hidden) return;
    if (e.target?.closest('#adminNavContextMenu')) return;
    closeAdminNavContextMenu();
  });
  document.addEventListener('contextmenu', (e) => {
    if (e.target?.closest('.admin-nav-btn') || e.target?.closest('#adminNavContextMenu')) return;
    closeAdminNavContextMenu();
  });
  startPhilippineClock();
  setAuthMode('login');
}

function startAuthLogoRender() {
  if (authLogoRenderStarted || !authLogoVideoEl || !authLogoCanvasEl) return;
  authLogoRenderStarted = true;

  const context = authLogoCanvasEl.getContext('2d', { willReadFrequently: true });
  if (!context) return;
  let hasStartedRender = false;

  function fitCanvas() {
    const width = Math.max(1, authLogoVideoEl.videoWidth || 720);
    const height = Math.max(1, authLogoVideoEl.videoHeight || 720);
    authLogoCanvasEl.width = width;
    authLogoCanvasEl.height = height;
  }

  function shouldProcessFrame() {
    return document.body.classList.contains('auth-locked') || document.body.classList.contains('auth-checking');
  }

  function renderFrame() {
    if (!shouldProcessFrame()) {
      requestAnimationFrame(renderFrame);
      return;
    }

    if (!authLogoVideoEl.videoWidth || !authLogoVideoEl.videoHeight) {
      requestAnimationFrame(renderFrame);
      return;
    }

    fitCanvas();
    context.drawImage(authLogoVideoEl, 0, 0, authLogoCanvasEl.width, authLogoCanvasEl.height);

    const frame = context.getImageData(0, 0, authLogoCanvasEl.width, authLogoCanvasEl.height);
    const pixels = frame.data;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const isWhite = r > 220 && g > 220 && b > 220;
      if (isWhite) {
        pixels[i + 3] = 0;
      } else if (r > 190 && g > 185 && b > 180) {
        pixels[i + 3] = Math.max(0, pixels[i + 3] - 120);
      }
    }

    context.putImageData(frame, 0, 0);
    requestAnimationFrame(renderFrame);
  }

  function ensurePlayback() {
    authLogoVideoEl.muted = true;
    authLogoVideoEl.loop = true;
    authLogoVideoEl.playsInline = true;
    const playPromise = authLogoVideoEl.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  }

  function startRenderIfReady() {
    if (hasStartedRender) return;
    if (authLogoVideoEl.readyState < 2) return;
    hasStartedRender = true;
    fitCanvas();
    renderFrame();
  }

  authLogoVideoEl.addEventListener('loadedmetadata', () => {
    ensurePlayback();
    startRenderIfReady();
  });
  authLogoVideoEl.addEventListener('loadeddata', () => {
    ensurePlayback();
    startRenderIfReady();
  });
  authLogoVideoEl.addEventListener('canplay', () => {
    ensurePlayback();
    startRenderIfReady();
  });
  authLogoVideoEl.addEventListener('pause', ensurePlayback);
  authLogoVideoEl.addEventListener('ended', ensurePlayback);
  authLogoVideoEl.addEventListener('stalled', ensurePlayback);

  ensurePlayback();
  if (authLogoVideoEl.readyState >= 2) {
    startRenderIfReady();
  }
}

async function bootstrap() {
  setupAuth();
  startAuthLogoRender();
  document.body.classList.add('auth-checking');
  const activeUser = readActiveSession();
  const token = readAccessToken();

  if (activeUser?.email && token) {
    activeAuthSession = {
      name: activeUser.name || 'User',
      email: activeUser.email,
      role: activeUser.role || 'encharge',
      userId: activeUser.userId || null
    };
    hydrateCashierShiftState();
    unlockDashboard();
    startAppOnce();
    document.body.classList.remove('auth-checking');

    try {
      const sessionResult = await api('/api/auth/session', {
        method: 'POST',
        body: JSON.stringify({ accessToken: token })
      });
      activeAuthSession = {
        name: sessionResult.user.fullName,
        email: sessionResult.user.email,
        role: sessionResult.user.role || 'encharge',
        userId: sessionResult.user.id
      };
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(activeAuthSession));
      restoreAdminNavOrder();
      hydrateCashierShiftState();
      unlockDashboard();
      if (canViewShiftMonitorOnPos(activeAuthSession?.role) && needsCashierShiftStart()) {
        await presentStartShiftModal();
      }
    } catch (error) {
      const errorText = String(error?.message || '');
      const isNetworkLike = /fetch|network|offline|failed to fetch/i.test(errorText);
      if (!isNetworkLike) {
        clearActiveSession();
        lockDashboard();
        if (loginEmailEl) loginEmailEl.focus();
      } else if (canViewShiftMonitorOnPos(activeAuthSession?.role) && needsCashierShiftStart()) {
        await presentStartShiftModal();
      }
    }
    return;
  }
  clearActiveSession();
  lockDashboard();
  document.body.classList.remove('auth-checking');
  if (loginEmailEl) loginEmailEl.focus();
}

// ------------------------------------------
// Tab Navigation
// ------------------------------------------

function switchTab(tabName) {
  tabBtns.forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });
  tabContents.forEach((content) => {
    content.classList.toggle('active', content.id === `tab-${tabName}`);
  });

  if (tabName === 'admin') {
    refreshSalesReport(activeSalesRange);
  }
}

function normalizeAdminPanelName(panelName) {
  const normalized = String(panelName || '').trim().toLowerCase();
  return ADMIN_PANEL_ORDER.includes(normalized) ? normalized : 'overview';
}

function getAdminNavPanelName(button) {
  if (!(button instanceof HTMLElement)) return '';
  const panelName = String(button.dataset.adminPanel || '').trim().toLowerCase();
  return ADMIN_PANEL_ORDER.includes(panelName) ? panelName : '';
}

function normalizeAdminNavOrder(order) {
  const nextOrder = [];
  const seenPanels = new Set();
  const requestedOrder = Array.isArray(order) ? order : [];
  requestedOrder.forEach((panelName) => {
    const normalized = String(panelName || '').trim().toLowerCase();
    if (!ADMIN_PANEL_ORDER.includes(normalized) || seenPanels.has(normalized) || !(ADMIN_NAV_BUTTONS[normalized] instanceof HTMLElement)) {
      return;
    }
    seenPanels.add(normalized);
    nextOrder.push(normalized);
  });
  ADMIN_NAV_ENTRIES.forEach(({ panelName }) => {
    if (!seenPanels.has(panelName)) {
      seenPanels.add(panelName);
      nextOrder.push(panelName);
    }
  });
  return nextOrder;
}

function getCurrentAdminNavOrder() {
  if (!adminNavEl) return normalizeAdminNavOrder();
  return normalizeAdminNavOrder(
    Array.from(adminNavEl.querySelectorAll('.admin-nav-btn')).map((button) => getAdminNavPanelName(button))
  );
}

function applyAdminNavOrder(order) {
  if (!adminNavEl) return;
  const fragment = document.createDocumentFragment();
  normalizeAdminNavOrder(order).forEach((panelName) => {
    const button = ADMIN_NAV_BUTTONS[panelName];
    if (button instanceof HTMLElement) {
      fragment.appendChild(button);
    }
  });
  adminNavEl.appendChild(fragment);
  refreshAdminNavContextMenu();
}

function restoreAdminNavOrder(order = readUserUiState()?.adminNavOrder) {
  applyAdminNavOrder(order);
}

function persistAdminNavOrder() {
  saveUserUiState({ adminNavOrder: getCurrentAdminNavOrder() });
}

function getAdminNavMoveAvailability(panelName) {
  const button = ADMIN_NAV_BUTTONS[panelName];
  if (!(button instanceof HTMLElement)) {
    return { canMovePrev: false, canMoveNext: false };
  }
  const previousButton = button.previousElementSibling;
  const nextButton = button.nextElementSibling;
  return {
    canMovePrev: previousButton instanceof HTMLElement && previousButton.classList.contains('admin-nav-btn'),
    canMoveNext: nextButton instanceof HTMLElement && nextButton.classList.contains('admin-nav-btn')
  };
}

function closeAdminNavContextMenu() {
  activeAdminNavContextPanel = '';
  if (!adminNavContextMenuEl) return;
  adminNavContextMenuEl.hidden = true;
  adminNavContextMenuEl.classList.remove('open');
}

function refreshAdminNavContextMenu(panelName = activeAdminNavContextPanel) {
  if (!adminNavContextMenuEl || adminNavContextMenuEl.hidden || !panelName) return;
  const { canMovePrev, canMoveNext } = getAdminNavMoveAvailability(panelName);
  if (adminNavContextPrevBtn instanceof HTMLButtonElement) {
    adminNavContextPrevBtn.disabled = !canMovePrev;
  }
  if (adminNavContextNextBtn instanceof HTMLButtonElement) {
    adminNavContextNextBtn.disabled = !canMoveNext;
  }
}

function openAdminNavContextMenu(panelName, clientX, clientY) {
  if (!adminNavContextMenuEl || !panelName) return;
  activeAdminNavContextPanel = panelName;
  adminNavContextMenuEl.hidden = false;
  adminNavContextMenuEl.classList.add('open');
  adminNavContextMenuEl.style.left = '0px';
  adminNavContextMenuEl.style.top = '0px';
  refreshAdminNavContextMenu(panelName);
  const menuWidth = adminNavContextMenuEl.offsetWidth || 180;
  const menuHeight = adminNavContextMenuEl.offsetHeight || 96;
  const left = Math.max(12, Math.min(clientX, window.innerWidth - menuWidth - 12));
  const top = Math.max(12, Math.min(clientY, window.innerHeight - menuHeight - 12));
  adminNavContextMenuEl.style.left = `${left}px`;
  adminNavContextMenuEl.style.top = `${top}px`;
}

function moveAdminNavButton(panelName, direction) {
  if (!adminNavEl) return;
  const button = ADMIN_NAV_BUTTONS[panelName];
  if (!(button instanceof HTMLElement)) return;
  if (direction === 'prev') {
    const previousButton = button.previousElementSibling;
    if (previousButton instanceof HTMLElement && previousButton.classList.contains('admin-nav-btn')) {
      adminNavEl.insertBefore(button, previousButton);
    }
  } else if (direction === 'next') {
    const nextButton = button.nextElementSibling;
    if (nextButton instanceof HTMLElement && nextButton.classList.contains('admin-nav-btn')) {
      adminNavEl.insertBefore(button, nextButton.nextElementSibling);
    }
  }
  persistAdminNavOrder();
  refreshAdminNavContextMenu(panelName);
}

function handleAdminNavButtonClick(event) {
  closeAdminNavContextMenu();
  const panelName = getAdminNavPanelName(event.currentTarget?.closest('.admin-nav-btn'));
  if (panelName) {
    switchAdminPanel(panelName);
  }
}

function handleAdminNavButtonContextMenu(event) {
  event.preventDefault();
  const panelName = getAdminNavPanelName(event.currentTarget);
  if (!panelName) return;
  openAdminNavContextMenu(panelName, event.clientX, event.clientY);
}

function handleAdminNavMoveButtonClick(event) {
  event.preventDefault();
  event.stopPropagation();
  const direction = String(event.currentTarget?.dataset.adminMove || '').trim().toLowerCase();
  if (!activeAdminNavContextPanel || (direction !== 'prev' && direction !== 'next')) return;
  const panelName = activeAdminNavContextPanel;
  moveAdminNavButton(panelName, direction);
  closeAdminNavContextMenu();
}

function setupAdminNavButtons() {
  ADMIN_NAV_ENTRIES.forEach(({ panelName, button }) => {
    if (!(button instanceof HTMLElement) || button.dataset.adminNavBound === 'true') return;
    button.dataset.adminPanel = panelName;
    button.dataset.adminNavBound = 'true';
    const openBtn = button.querySelector('.admin-nav-main-btn');
    if (openBtn instanceof HTMLButtonElement) {
      openBtn.addEventListener('click', handleAdminNavButtonClick);
    }
    button.addEventListener('contextmenu', handleAdminNavButtonContextMenu);
  });
  if (adminNavContextPrevBtn instanceof HTMLButtonElement) {
    adminNavContextPrevBtn.dataset.adminMove = 'prev';
    adminNavContextPrevBtn.addEventListener('click', handleAdminNavMoveButtonClick);
  }
  if (adminNavContextNextBtn instanceof HTMLButtonElement) {
    adminNavContextNextBtn.dataset.adminMove = 'next';
    adminNavContextNextBtn.addEventListener('click', handleAdminNavMoveButtonClick);
  }
}

function switchAdminPanel(panelName, { persist = true } = {}) {
  const activePanel = getFirstAccessibleAdminPanel(panelName);
  const isOverview = activePanel === 'overview';
  const isInventory = activePanel === 'inventory';
  const isKit = activePanel === 'kit-spec';
  const isUsers = activePanel === 'users';
  const isOperations = activePanel === 'operations';
  const isReceiptTemplates = activePanel === 'receipt-templates';
  const isReports = activePanel === 'reports';
  const isOthers = activePanel === 'others';

  if (adminPanelOverviewEl) adminPanelOverviewEl.classList.toggle('active', isOverview);
  if (adminPanelInventoryEl) adminPanelInventoryEl.classList.toggle('active', isInventory);
  if (adminPanelKitSpecEl) adminPanelKitSpecEl.classList.toggle('active', isKit);
  if (adminPanelUsersEl) adminPanelUsersEl.classList.toggle('active', isUsers);
  if (adminPanelOperationsEl) adminPanelOperationsEl.classList.toggle('active', isOperations);
  if (adminPanelReceiptTemplatesEl) adminPanelReceiptTemplatesEl.classList.toggle('active', isReceiptTemplates);
  if (adminPanelReportsEl) adminPanelReportsEl.classList.toggle('active', isReports);
  if (adminPanelOthersEl) adminPanelOthersEl.classList.toggle('active', isOthers);

  if (adminNavOverviewBtn) adminNavOverviewBtn.classList.toggle('active', isOverview);
  if (adminNavInventoryBtn) adminNavInventoryBtn.classList.toggle('active', isInventory);
  if (adminNavKitSpecBtn) adminNavKitSpecBtn.classList.toggle('active', isKit);
  if (adminNavUsersBtn) adminNavUsersBtn.classList.toggle('active', isUsers);
  if (adminNavOperationsBtn) adminNavOperationsBtn.classList.toggle('active', isOperations);
  if (adminNavReceiptTemplatesBtn) adminNavReceiptTemplatesBtn.classList.toggle('active', isReceiptTemplates);
  if (adminNavReportsBtn) adminNavReportsBtn.classList.toggle('active', isReports);
  if (adminNavOthersBtn) adminNavOthersBtn.classList.toggle('active', isOthers);

  if (isInventory) {
    refreshInventoryModule();
  }
  if (isKit) {
    refreshKitSpecModule();
  }
  if (isUsers) {
    refreshAdminUsers();
  }
  if (isOperations) {
    refreshCashierMonitoring();
    refreshShiftManagement();
    refreshDiscrepancyAlerts();
  }
  if (isReceiptTemplates) {
    refreshReceiptTemplatesModule();
  }
  if (isOverview) {
    refreshSalesReport(activeSalesRange);
  }
  if (isOthers) {
    refreshDiscountManager();
    refreshMonthlyClosingModule();
  }
  if (persist) {
    saveUserUiState({ adminPanel: activePanel });
  }
}

async function openAdminDashboard({ panelName, persist = true } = {}) {
  if (!canAccessAdminFeatures()) {
    fireAudit('admin_access_denied', { reason: 'role_blocked', role: activeAuthSession?.role || 'unknown' });
    setStatus('Current role does not have Control Center access.');
    return;
  }
  fireAudit('admin_access_allowed', { role: activeAuthSession?.role || 'unknown' });
  updateAdminNavVisibility();
  const restoredPanel = panelName || readUserUiState()?.adminPanel;
  const activePanel = getFirstAccessibleAdminPanel(restoredPanel);
  document.body.classList.add('admin-open');
  saveUserUiState({ adminOpen: true });
  switchAdminPanel(activePanel, { persist });
}

function closeAdminDashboard() {
  closeAdminNavContextMenu();
  document.body.classList.remove('admin-open');
  saveUserUiState({ adminOpen: false });
}

// ------------------------------------------
// POS Terminal Functions
// ------------------------------------------

function getCategoryName(category) {
  const key = String(category || '').trim().toLowerCase();
  const matched = (state.categories || []).find((x) => String(x.key || '').toLowerCase() === key);
  if (matched?.name) return matched.name;
  return category ? String(category) : 'Menu';
}

function normalizeMenuCategoryKey(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 64);
}

function getDefaultCategoryImage(categoryKey) {
  const defaultByKey = {
    'main-dish': '/Menu/Main Dish.png',
    rice: '/Menu/Rice.png',
    burger: '/Menu/Burger.png',
    drinks: '/Menu/Drinks.png',
    fries: '/Menu/Fries.png',
    dessert: '/Menu/Dessert.png',
    sauces: '/Menu/Sauce.png'
  };
  const key = normalizeMenuCategoryKey(categoryKey);
  return defaultByKey[key] || GENERIC_CATEGORY_ICON;
}

function renderCategoryButtons() {
  if (!categoryButtonsEl) return;
  const rows = (state.categories || [])
    .map((category) => {
      const key = String(category.key || '').toLowerCase();
      const isActive = key === String(state.activeCategory || '').toLowerCase();
      return `
        <button class="category-btn ${isActive ? 'active' : ''}" data-category="${escapeHtml(key)}">
          <img class="category-icon" src="${escapeHtml(category.image || getDefaultCategoryImage(key))}" alt="${escapeHtml(category.name || key)}" />
          <span class="category-label">${escapeHtml(category.name || key)}</span>
        </button>
      `;
    })
    .join('');

  categoryButtonsEl.innerHTML = rows || '<p class="status">No categories available.</p>';
}

function preloadProductImages(products) {
  const activeCategory = String(state.activeCategory || '').toLowerCase();
  const activeImages = [];
  const deferredImages = [];
  const seen = new Set();

  (products || []).forEach((product) => {
    const src = String(product?.image || '').trim();
    if (!src || seen.has(src)) return;
    seen.add(src);
    if (String(product?.category || '').toLowerCase() === activeCategory) {
      activeImages.push(src);
    } else {
      deferredImages.push(src);
    }
  });

  const primeImage = (src) => {
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  };

  activeImages.slice(0, 8).forEach(primeImage);

  const warmDeferred = () => {
    deferredImages.forEach(primeImage);
    activeImages.slice(8).forEach(primeImage);
  };

  if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(warmDeferred, { timeout: 1200 });
    return;
  }

  setTimeout(warmDeferred, 0);
}

function renderProducts() {
  productsEl.innerHTML = '';

  const activeCategory = String(state.activeCategory || '').toLowerCase();
  const activeProducts = (state.products || []).filter((product) => String(product?.category || '').toLowerCase() === activeCategory);

  if (!activeProducts.length) {
    productsEl.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 20px;">No products available.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  activeProducts.forEach((p, index) => {
    const availabilityClass = getProductAvailabilityClass(p);
    const isUnavailable = !Boolean(p.isAvailable);
    const buttonLabel = isUnavailable ? getProductDisabledButtonLabel(p) : 'Add to Order';
    const prioritizeImage = index < 6;
    const indicatorMarkup = isUnavailable
      ? `
        <div class="product-availability ${availabilityClass}">
          <div class="product-availability-label">${escapeHtml(p.availabilityLabel || 'Unavailable')}</div>
          <div class="product-availability-reason">${escapeHtml(p.availabilityReason || 'This product is not ready for selling.')}</div>
        </div>
      `
      : '';
    const row = document.createElement('div');
    row.className = `product-row${isUnavailable ? ' unavailable' : ''}`;
    row.setAttribute('data-category', String(p.category || '').toLowerCase());
    row.innerHTML = `
      <img class="product-image" src="${p.image || '/Business Logo/Ruels Logo for business.png'}" alt="${p.name}" loading="${prioritizeImage ? 'eager' : 'lazy'}" fetchpriority="${prioritizeImage ? 'high' : 'auto'}" decoding="async" />
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${money(p.price)}</div>
        ${indicatorMarkup}
      </div>
      <button data-add="${p.id}" ${isUnavailable ? 'disabled' : ''}>${buttonLabel}</button>
    `;
    fragment.appendChild(row);
  });

  productsEl.appendChild(fragment);
}

function setPaymentMethod(method) {
  paymentMethodEl.value = method;
  onPaymentMethodChange();
  cashPaymentBtn?.classList.toggle('active', method === 'cash');
  ePaymentBtn?.classList.toggle('active', method !== 'cash');
}

function switchCategory(category) {
  const selected = String(category || '').toLowerCase();
  if (!selected) return;
  state.activeCategory = selected;
  saveUserUiState({ activeCategory: selected });

  document.querySelectorAll('.category-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.getAttribute('data-category') === selected);
  });

  categoryTitleEl.textContent = getCategoryName(selected);
  renderProducts();
}

async function refreshCatalog({ keepCategory = true } = {}) {
  const result = await api('/api/products');
  applyAppConfig(result?.appConfig || state.appConfig);
  const nextCategories = Array.isArray(result.categories) ? result.categories : [];
  const nextProducts = Array.isArray(result.products) ? result.products : [];

  state.categories = nextCategories.map((x) => ({
    key: String(x.key || '').trim().toLowerCase(),
    name: String(x.name || '').trim() || String(x.key || ''),
    image: String(x.image || '').trim() || getDefaultCategoryImage(x.key),
    sortOrder: Number(x.sortOrder || 0)
  }));
  state.products = nextProducts.map((x) => ({
    ...toClientProduct(x)
  }));

  if (!state.categories.length) {
    state.categories = [{
      key: 'main-dish',
      name: 'Main Dish',
      image: '/Menu/Main Dish.png',
      sortOrder: 10
    }];
  }

  const categoryKeys = new Set(state.categories.map((x) => x.key));
  if (!keepCategory || !categoryKeys.has(String(state.activeCategory || '').toLowerCase())) {
    state.activeCategory = state.categories[0].key;
  }

  writeCatalogCache({ categories: state.categories, products: state.products });
  renderCategoryButtons();
  switchCategory(state.activeCategory);
  renderCart();
  preloadProductImages(state.products);
}

function openMenuEditor() {
  if (!menuEditorModalEl) return;
  if (!canAccessMenuEditor()) {
    setStatus('Current role does not have menu editor access.');
    return;
  }
  document.body.classList.add('menu-editor-open');
}

function closeMenuEditor() {
  if (!menuEditorModalEl) return;
  document.body.classList.remove('menu-editor-open');
}

function warmMenuEditorInBackground({ force = false } = {}) {
  if (!canAccessMenuEditor()) return;
  if (!force && menuEditorWarmReady) return;
  if (menuEditorWarmInFlight) return;

  menuEditorWarmInFlight = true;
  const runWarmup = async () => {
    try {
      fillMenuCategorySelectOptions();
      renderMenuCategoryEditorRows();
      renderMenuProductEditorRows();
      await refreshMenuEditorData();
      menuEditorWarmReady = true;
    } catch (_error) {
      // Keep silent in background warmup.
    } finally {
      menuEditorWarmInFlight = false;
    }
  };

  if (typeof window !== 'undefined' && typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(() => {
      runWarmup();
    }, { timeout: 1200 });
    return;
  }

  setTimeout(() => {
    runWarmup();
  }, 0);
}

function fillMenuCategorySelectOptions() {
  if (!menuProductCategoryInputEl) return;
  menuProductCategoryInputEl.innerHTML = (state.categories || [])
    .map((x) => `<option value="${escapeHtml(x.key)}">${escapeHtml(x.name)}</option>`)
    .join('');
}

function renderMenuCategoryEditorRows() {
  if (!menuCategoryEditorListEl) return;
  if (!state.categories.length) {
    menuCategoryEditorListEl.innerHTML = '<p>No categories available.</p>';
    return;
  }

  const rows = state.categories.map((c) => {
    const imageSrc = String(c.image || getDefaultCategoryImage(c.key));
    return `
      <div class="menu-category-editor-row" data-category-key="${escapeHtml(c.key)}">
        <input type="text" class="menu-edit-category-name" value="${escapeHtml(c.name)}" />
        <div class="menu-category-image-wrap">
          <input type="hidden" class="menu-current-category-image" value="${escapeHtml(imageSrc)}" />
          <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(c.name)}" />
          <input type="file" class="menu-edit-category-image-file" accept="image/*" />
        </div>
        <button type="button" class="menu-save-category-btn">Save Category</button>
        <button type="button" class="menu-delete-btn menu-delete-category-btn">Delete</button>
      </div>
    `;
  }).join('');

  menuCategoryEditorListEl.innerHTML = rows;
}

function renderMenuProductEditorRows() {
  if (!menuProductEditorListEl) return;
  if (!state.products.length) {
    menuProductEditorListEl.innerHTML = '<p>No products available.</p>';
    return;
  }

  const categoryOptions = (state.categories || [])
    .map((x) => `<option value="${escapeHtml(x.key)}">${escapeHtml(x.name)}</option>`)
    .join('');

  const rows = state.products.map((p) => {
    const imageSrc = String(p.image || '/Business Logo/Ruels Logo for business.png');
    return `
      <div class="menu-product-editor-row" data-product-id="${escapeHtml(p.id)}">
        <input type="text" class="menu-edit-name" value="${escapeHtml(p.name)}" />
        <input type="number" class="menu-edit-price" min="0" step="0.01" value="${Number(p.price || 0).toFixed(2)}" />
        <select class="menu-edit-category">${categoryOptions}</select>
        <input type="hidden" class="menu-current-image" value="${escapeHtml(imageSrc)}" />
        <div class="row">
          <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(p.name)}" />
          <input type="file" class="menu-edit-image-file" accept="image/*" />
        </div>
        <button type="button" class="menu-save-product-btn">Save</button>
        <button type="button" class="menu-delete-btn menu-delete-product-btn">Delete</button>
      </div>
    `;
  }).join('');

  menuProductEditorListEl.innerHTML = rows;
  menuProductEditorListEl.querySelectorAll('.menu-product-editor-row').forEach((row) => {
    const productId = row.getAttribute('data-product-id');
    const product = state.products.find((x) => x.id === productId);
    const categorySelect = row.querySelector('.menu-edit-category');
    if (categorySelect && product?.category) {
      categorySelect.value = product.category;
    }
  });
}

async function readFileAsDataUrl(fileInputEl) {
  const file = fileInputEl?.files?.[0];
  if (!file) return '';
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Cannot read image file.'));
    reader.readAsDataURL(file);
  });
}

async function refreshMenuEditorData() {
  await refreshCatalog({ keepCategory: true });
  fillMenuCategorySelectOptions();
  renderMenuCategoryEditorRows();
  renderMenuProductEditorRows();
  menuEditorWarmReady = true;
}

async function handleMenuCategorySubmit(event) {
  event.preventDefault();
  if (!canAccessMenuEditor()) {
    setStatus('Current role does not have menu editor access.');
    return;
  }

  const name = String(menuCategoryNameInputEl?.value || '').trim();

  if (!name) {
    setStatus('Category name is required.');
    showConfirmationToast({
      title: 'Validation error',
      message: 'Category name is required.',
      tone: 'warning',
      duration: 2200
    });
    return;
  }

  try {
    if (!window.confirm(`Add new category "${name}"?`)) {
      return;
    }
    const image = await readFileAsDataUrl(menuCategoryImageFileInputEl);
    if (menuCategoryAddBtn) {
      menuCategoryAddBtn.disabled = true;
      menuCategoryAddBtn.textContent = 'Adding...';
    }
    await api('/api/menu/categories', {
      method: 'POST',
      headers: { 'x-user-role': String(activeAuthSession?.role || '') },
      body: JSON.stringify({ name, image })
    });
    if (menuCategoryNameInputEl) menuCategoryNameInputEl.value = '';
    if (menuCategoryImageFileInputEl) menuCategoryImageFileInputEl.value = '';
    await refreshMenuEditorData();
    setStatus(`Category "${name}" added.`);
    showConfirmationToast({
      title: 'Category added',
      message: `"${name}" was added to menu categories.`,
      tone: 'success'
    });
  } catch (error) {
    setStatus(`Add category failed: ${error.message}`);
    showConfirmationToast({
      title: 'Add category failed',
      message: error.message,
      tone: 'warning',
      duration: 2600
    });
  } finally {
    if (menuCategoryAddBtn) {
      menuCategoryAddBtn.disabled = false;
      menuCategoryAddBtn.textContent = 'Add Category';
    }
  }
}

async function handleMenuProductSubmit(event) {
  event.preventDefault();
  if (!canAccessMenuEditor()) {
    setStatus('Current role does not have menu editor access.');
    return;
  }

  const name = String(menuProductNameInputEl?.value || '').trim();
  const price = Number(menuProductPriceInputEl?.value || 0);
  const category = String(menuProductCategoryInputEl?.value || '').trim().toLowerCase();

  if (!name) {
    setStatus('Product name is required.');
    showConfirmationToast({
      title: 'Validation error',
      message: 'Product name is required.',
      tone: 'warning',
      duration: 2200
    });
    return;
  }
  if (!Number.isFinite(price) || price < 0) {
    setStatus('Product price must be a number >= 0.');
    showConfirmationToast({
      title: 'Validation error',
      message: 'Product price must be a number greater than or equal to 0.',
      tone: 'warning',
      duration: 2400
    });
    return;
  }
  if (!category) {
    setStatus('Select a category for product.');
    showConfirmationToast({
      title: 'Validation error',
      message: 'Select a category for the product.',
      tone: 'warning',
      duration: 2200
    });
    return;
  }

  try {
    if (!window.confirm(`Add new product "${name}"?`)) {
      return;
    }
    if (menuProductAddBtn) {
      menuProductAddBtn.disabled = true;
      menuProductAddBtn.textContent = 'Adding...';
    }
    const imageFromFile = await readFileAsDataUrl(menuProductImageFileInputEl);
    await api('/api/menu/products', {
      method: 'POST',
      headers: { 'x-user-role': String(activeAuthSession?.role || '') },
      body: JSON.stringify({
        name,
        price,
        category,
        image: imageFromFile
      })
    });
    if (menuProductNameInputEl) menuProductNameInputEl.value = '';
    if (menuProductPriceInputEl) menuProductPriceInputEl.value = '';
    if (menuProductImageFileInputEl) menuProductImageFileInputEl.value = '';
    await refreshMenuEditorData();
    setStatus(`Product "${name}" added.`);
    showConfirmationToast({
      title: 'Product added',
      message: `"${name}" was added successfully.`,
      tone: 'success'
    });
  } catch (error) {
    setStatus(`Add product failed: ${error.message}`);
    showConfirmationToast({
      title: 'Add product failed',
      message: error.message,
      tone: 'warning',
      duration: 2600
    });
  } finally {
    if (menuProductAddBtn) {
      menuProductAddBtn.disabled = false;
      menuProductAddBtn.textContent = 'Add Product';
    }
  }
}

async function handleMenuCategoryEditorClick(event) {
  const deleteBtn = event.target.closest('.menu-delete-category-btn');
  if (deleteBtn) {
    const row = event.target.closest('.menu-category-editor-row');
    const categoryKey = String(row?.getAttribute('data-category-key') || '').trim().toLowerCase();
    const categoryName = String(row?.querySelector('.menu-edit-category-name')?.value || categoryKey).trim();
    if (!categoryKey) return;
    if (!window.confirm(`Delete category "${categoryName}" and all products under it?`)) {
      return;
    }

    try {
      deleteBtn.disabled = true;
      deleteBtn.textContent = 'Deleting...';
      await api(`/api/menu/categories/${encodeURIComponent(categoryKey)}`, {
        method: 'DELETE',
        headers: { 'x-user-role': String(activeAuthSession?.role || '') }
      });
      await refreshMenuEditorData();
      showConfirmationToast({
        title: 'Category deleted',
        message: `"${categoryName}" and its products were removed from menu.`,
        tone: 'success'
      });
      setStatus(`Category "${categoryName}" deleted.`);
    } catch (error) {
      showConfirmationToast({
        title: 'Delete category failed',
        message: error.message,
        tone: 'warning',
        duration: 2600
      });
      setStatus(`Delete category failed: ${error.message}`);
    } finally {
      deleteBtn.disabled = false;
      deleteBtn.textContent = 'Delete';
    }
    return;
  }

  const saveBtn = event.target.closest('.menu-save-category-btn');
  if (!saveBtn) return;

  const row = event.target.closest('.menu-category-editor-row');
  const categoryKey = String(row?.getAttribute('data-category-key') || '').trim().toLowerCase();
  if (!row || !categoryKey) return;

  const name = String(row.querySelector('.menu-edit-category-name')?.value || '').trim();
  const currentImage = String(row.querySelector('.menu-current-category-image')?.value || '').trim();
  const imageFileInput = row.querySelector('.menu-edit-category-image-file');

  if (!name) {
    setStatus('Category name cannot be empty.');
    showConfirmationToast({
      title: 'Validation error',
      message: 'Category name cannot be empty.',
      tone: 'warning',
      duration: 2200
    });
    return;
  }

  try {
    if (!window.confirm(`Save changes for category "${name}"?`)) {
      return;
    }
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    const imageFromFile = await readFileAsDataUrl(imageFileInput);
    await api(`/api/menu/categories/${encodeURIComponent(categoryKey)}`, {
      method: 'PUT',
      headers: { 'x-user-role': String(activeAuthSession?.role || '') },
      body: JSON.stringify({
        name,
        image: imageFromFile || currentImage
      })
    });
    await refreshMenuEditorData();
    setStatus(`Category "${name}" updated.`);
    showConfirmationToast({
      title: 'Category updated',
      message: `"${name}" changes were saved.`,
      tone: 'success'
    });
  } catch (error) {
    setStatus(`Update category failed: ${error.message}`);
    showConfirmationToast({
      title: 'Update category failed',
      message: error.message,
      tone: 'warning',
      duration: 2600
    });
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save Category';
  }
}

async function handleMenuProductEditorClick(event) {
  const deleteBtn = event.target.closest('.menu-delete-product-btn');
  if (deleteBtn) {
    const row = event.target.closest('.menu-product-editor-row');
    const productId = row?.getAttribute('data-product-id');
    const productName = String(row?.querySelector('.menu-edit-name')?.value || '').trim() || String(productId || '');
    if (!productId) return;
    if (!window.confirm(`Delete product "${productName}"?`)) {
      return;
    }

    try {
      deleteBtn.disabled = true;
      deleteBtn.textContent = 'Deleting...';
      await api(`/api/menu/products/${encodeURIComponent(productId)}`, {
        method: 'DELETE',
        headers: { 'x-user-role': String(activeAuthSession?.role || '') }
      });
      await refreshMenuEditorData();
      showConfirmationToast({
        title: 'Product deleted',
        message: `"${productName}" was removed from menu.`,
        tone: 'success'
      });
      setStatus(`Product "${productName}" deleted.`);
    } catch (error) {
      showConfirmationToast({
        title: 'Delete product failed',
        message: error.message,
        tone: 'warning',
        duration: 2600
      });
      setStatus(`Delete product failed: ${error.message}`);
    } finally {
      deleteBtn.disabled = false;
      deleteBtn.textContent = 'Delete';
    }
    return;
  }

  const saveBtn = event.target.closest('.menu-save-product-btn');
  if (!saveBtn) return;

  const row = event.target.closest('.menu-product-editor-row');
  const productId = row?.getAttribute('data-product-id');
  if (!row || !productId) return;

  const name = String(row.querySelector('.menu-edit-name')?.value || '').trim();
  const price = Number(row.querySelector('.menu-edit-price')?.value || 0);
  const category = String(row.querySelector('.menu-edit-category')?.value || '').trim().toLowerCase();
  const currentImage = String(row.querySelector('.menu-current-image')?.value || '').trim();
  const imageFileInput = row.querySelector('.menu-edit-image-file');

  if (!name) {
    setStatus('Product name cannot be empty.');
    showConfirmationToast({
      title: 'Validation error',
      message: 'Product name cannot be empty.',
      tone: 'warning',
      duration: 2200
    });
    return;
  }
  if (!Number.isFinite(price) || price < 0) {
    setStatus('Product price must be a number >= 0.');
    showConfirmationToast({
      title: 'Validation error',
      message: 'Product price must be a number greater than or equal to 0.',
      tone: 'warning',
      duration: 2400
    });
    return;
  }
  if (!category) {
    setStatus('Product category is required.');
    showConfirmationToast({
      title: 'Validation error',
      message: 'Product category is required.',
      tone: 'warning',
      duration: 2200
    });
    return;
  }

  try {
    if (!window.confirm(`Save changes for product "${name}"?`)) {
      return;
    }
    saveBtn.disabled = true;
    saveBtn.textContent = 'Saving...';
    const imageFromFile = await readFileAsDataUrl(imageFileInput);
    await api(`/api/menu/products/${encodeURIComponent(productId)}`, {
      method: 'PUT',
      headers: { 'x-user-role': String(activeAuthSession?.role || '') },
      body: JSON.stringify({
        name,
        price,
        category,
        image: imageFromFile || currentImage
      })
    });
    await refreshMenuEditorData();
    setStatus(`Product "${name}" updated.`);
    showConfirmationToast({
      title: 'Product updated',
      message: `"${name}" changes were saved.`,
      tone: 'success'
    });
  } catch (error) {
    setStatus(`Update product failed: ${error.message}`);
    showConfirmationToast({
      title: 'Update product failed',
      message: error.message,
      tone: 'warning',
      duration: 2600
    });
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'Save';
  }
}

function renderCart() {
  if (!cartEl) return;
  cartEl.innerHTML = '';

  const items = getCartItems();
  const displayItems = [...items].reverse();
  if (!items.length) {
    cartEl.innerHTML = '<p>No Orders Yet</p>'; 
  } else {
    const byId = Object.fromEntries(state.products.map((p) => [p.id, p]));
    displayItems.forEach(({ productId, qty }) => {
      const p = byId[productId];
      const row = document.createElement('div');
      row.className = 'cart-row';
      row.innerHTML = `
        <div class="cart-item-name">${p.name} x ${qty}</div>
        <div class="cart-item-price">
          ${money(p.price * qty)}
          <button class="secondary" data-remove="${p.id}">-1</button>
        </div>
      `;
      cartEl.appendChild(row);
    });
  }

  const subtotal = getCartTotal();
  const selectedProfile = getSelectedDiscountProfile();
  const discount = getDiscountAmount();
  const totalDue = getTotalDue();
  state.discountAmount = discount;
  if (subtotalValueEl) subtotalValueEl.textContent = money(subtotal);
  if (totalDueValueEl) totalDueValueEl.textContent = money(totalDue);
  renderDiscountProfileSelect();
  if (discountPreviousTotalValueEl) discountPreviousTotalValueEl.textContent = money(subtotal);
  if (discountAppliedLabelEl) {
    discountAppliedLabelEl.textContent = getDiscountProfileSummaryText(selectedProfile);
  }
  if (discountDeductionValueEl) discountDeductionValueEl.textContent = money(discount);
  if (discountCurrentTotalValueEl) discountCurrentTotalValueEl.textContent = money(totalDue);
}

function onProductClick(e) {
  const addId = e.target.getAttribute('data-add');
  const removeId = e.target.getAttribute('data-remove');

  if (addId) {
    const product = (state.products || []).find((x) => String(x.id) === String(addId));
    if (product && !product.isAvailable) {
      const reason = String(product.availabilityLabel || product.availabilityReason || 'This product is unavailable.').trim();
      setStatus(`${product.name} cannot be added right now. ${reason}`);
      return;
    }
    const currentQty = Number(state.cart[addId] || 0);
    const availableUnits = Number(product?.availableUnits || 0);
    if (product && Number.isFinite(availableUnits) && availableUnits > 0 && currentQty >= availableUnits) {
      setStatus(`${product.name} only has ${availableUnits} serving(s) available based on the current kit specification stock.`);
      return;
    }
    state.cart[addId] = (state.cart[addId] || 0) + 1;
    renderCart();
    playAddToCartConfetti();
  }

  if (removeId) {
    state.cart[removeId] = Math.max(0, (state.cart[removeId] || 0) - 1);
    renderCart();
  }
}

function resetAfterSale() {
  state.cart = {};
  state.activeInvoice = null;
  state.scanQrContext = null;
  state.selectedDiscountProfileId = '';
  state.discountAmount = 0;
  gcashInfoEl.innerHTML = '';
  if (state.poller) {
    clearInterval(state.poller);
    state.poller = null;
  }
  closeScanQrModal();
  // Clear customer info fields
  if (customerNameEl) customerNameEl.value = '';
  if (customerEmailEl) customerEmailEl.value = '';
  if (customerPhoneEl) customerPhoneEl.value = '';
  renderCart();
}

function updateReceiptActionVisibility() {
  const hasReceipt = Boolean(state.lastPaidInvoice);
  const canHoldForVoid = Boolean(
    hasReceipt
    && canManageInvoiceActions()
    && String(state.lastPaidInvoice?.status || '').trim().toUpperCase() === 'PAID'
  );
  if (statusReceiptActionsEl) {
    statusReceiptActionsEl.style.display = hasReceipt ? 'flex' : 'none';
  }
  if (statusPrintReceiptBtn) {
    statusPrintReceiptBtn.disabled = !hasReceipt;
  }
  if (statusHoldForVoidBtn) {
    statusHoldForVoidBtn.disabled = !canHoldForVoid;
    statusHoldForVoidBtn.textContent = canHoldForVoid ? 'Hold for Void' : 'Hold for Void Requested';
  }
  if (receiptHoldForVoidBtn) {
    receiptHoldForVoidBtn.disabled = !canHoldForVoid;
    receiptHoldForVoidBtn.textContent = canHoldForVoid ? 'Hold for Void' : 'Hold for Void Requested';
  }
}

function setReceiptTemplateContent(el, value) {
  if (!el) return;
  const text = String(value || '').trim();
  el.textContent = text;
  el.style.display = text ? '' : 'none';
}

function applyReceiptTemplateToArea(areaEl, template, refs = {}) {
  if (!areaEl) return;
  const settings = normalizeReceiptTemplate(template).settings;
  areaEl.style.setProperty('--receipt-paper-width', `${settings.paperWidthMm}mm`);
  areaEl.style.setProperty('--receipt-padding', `${settings.paddingPx}px`);
  areaEl.style.setProperty('--receipt-radius', `${settings.borderRadiusPx}px`);
  areaEl.style.setProperty('--receipt-font-family', settings.fontFamily);
  areaEl.style.setProperty('--receipt-base-font-size', `${settings.baseFontSizePx}px`);
  areaEl.style.setProperty('--receipt-title-size', `${settings.titleFontSizePx}px`);
  areaEl.style.setProperty('--receipt-meta-size', `${settings.metaFontSizePx}px`);
  areaEl.style.setProperty('--receipt-total-size', `${settings.totalFontSizePx}px`);
  areaEl.style.setProperty('--receipt-section-gap', `${settings.sectionGapPx}px`);
  areaEl.style.setProperty('--receipt-logo-width', `${settings.logoWidthPx}px`);
  areaEl.style.setProperty('--receipt-header-align', settings.headerAlign);
  areaEl.style.setProperty('--receipt-footer-align', settings.footerAlign);
  areaEl.style.setProperty('--receipt-background', settings.backgroundColor);
  areaEl.style.setProperty('--receipt-text-color', settings.textColor);
  areaEl.style.setProperty('--receipt-accent-color', settings.accentColor);
  areaEl.style.setProperty('--receipt-muted-color', settings.mutedColor);
  areaEl.style.setProperty('--receipt-border-color', settings.borderColor);
  areaEl.style.setProperty('--receipt-border-style', settings.borderStyle);
  areaEl.style.setProperty('--receipt-divider-style', settings.dividerStyle);
  areaEl.style.setProperty('--receipt-extra-note-align', settings.extraMessageAlign);
  areaEl.style.setProperty('--receipt-extra-note-style', settings.extraMessageStyle);
  areaEl.style.setProperty('--receipt-footer-size', `${settings.footerFontSizePx}px`);
  areaEl.style.setProperty('--receipt-footer-top-spacing', `${settings.footerTopSpacingPx}px`);
  areaEl.style.setProperty('--receipt-header-top-padding', `${settings.headerTopPaddingPx}px`);
  areaEl.style.setProperty('--receipt-header-offset-x', `${settings.headerOffsetX}px`);
  areaEl.style.setProperty('--receipt-header-offset-y', `${settings.headerOffsetY}px`);
  areaEl.style.setProperty('--receipt-meta-offset-x', `${settings.metaOffsetX}px`);
  areaEl.style.setProperty('--receipt-meta-offset-y', `${settings.metaOffsetY}px`);
  areaEl.style.setProperty('--receipt-items-offset-x', `${settings.itemsOffsetX}px`);
  areaEl.style.setProperty('--receipt-items-offset-y', `${settings.itemsOffsetY}px`);
  areaEl.style.setProperty('--receipt-totals-offset-x', `${settings.totalsOffsetX}px`);
  areaEl.style.setProperty('--receipt-totals-offset-y', `${settings.totalsOffsetY}px`);
  areaEl.style.setProperty('--receipt-footer-offset-x', `${settings.footerOffsetX}px`);
  areaEl.style.setProperty('--receipt-footer-offset-y', `${settings.footerOffsetY}px`);
  areaEl.style.setProperty('--receipt-extra-note-offset-x', `${settings.extraMessageOffsetX}px`);
  areaEl.style.setProperty('--receipt-extra-note-offset-y', `${settings.extraMessageOffsetY}px`);
  areaEl.classList.toggle('logo-hidden', settings.showLogo === false);

  const logoEl = refs.logoEl || areaEl.querySelector('.receipt-logo');
  if (logoEl) {
    logoEl.src = settings.logoUrl;
    logoEl.alt = `${settings.storeName} Logo`;
    logoEl.style.display = settings.showLogo === false ? 'none' : '';
  }

  setReceiptTemplateContent(refs.storeNameEl || areaEl.querySelector('.receipt-store-name'), settings.storeName);
  setReceiptTemplateContent(refs.orderSlipTitleEl || areaEl.querySelector('.receipt-order-slip-title'), settings.orderSlipTitle);
  setReceiptTemplateContent(refs.storeAddressEl || areaEl.querySelector('.receipt-store-address'), settings.storeAddress);
  setReceiptTemplateContent(refs.storeTaxEl || areaEl.querySelector('.receipt-store-tax'), settings.taxLine);
  setReceiptTemplateContent(refs.footerEl || areaEl.querySelector('.receipt-footer'), settings.footerMessage);
  setReceiptTemplateContent(refs.extraNoteEl || areaEl.querySelector('.receipt-extra-note'), settings.extraMessage);
}

function applyActiveReceiptTemplate() {
  const template = getActiveReceiptTemplate();
  state.activeReceiptTemplate = template;
  applyReceiptTemplateToArea(receiptPrintAreaEl, template, {
    logoEl: receiptLogoEl,
    orderSlipTitleEl: receiptOrderSlipTitleEl,
    storeNameEl: receiptStoreNameEl,
    storeAddressEl: receiptStoreAddressEl,
    storeTaxEl: receiptStoreTaxEl,
    footerEl: receiptFooterEl,
    extraNoteEl: receiptExtraNoteEl
  });
  applyReceiptTemplateToArea(adminReceiptPrintAreaEl, template, {
    logoEl: adminReceiptLogoEl,
    orderSlipTitleEl: adminReceiptOrderSlipTitleEl,
    storeNameEl: adminReceiptStoreNameEl,
    storeAddressEl: adminReceiptStoreAddressEl,
    storeTaxEl: adminReceiptStoreTaxEl,
    footerEl: adminReceiptFooterEl,
    extraNoteEl: adminReceiptExtraNoteEl
  });
}

function buildReceiptItemRows(items = []) {
  return (items || [])
    .map((item) => `
      <div class="receipt-item-row">
        <span>${escapeHtml(item.name)} x ${item.qty}</span>
        <strong>${money(item.subtotal)}</strong>
      </div>
    `)
    .join('');
}

function buildReceiptTemplatePreviewMarkup(template) {
  const settings = normalizeReceiptTemplate(template).settings;
  const invoice = RECEIPT_TEMPLATE_SAMPLE;
  return `
    <div class="receipt-print-area receipt-template-preview-surface">
      <div class="receipt-header receipt-preview-draggable" data-preview-drag="header" title="Drag to move header in preview">
        <img class="receipt-logo" src="${escapeHtml(settings.logoUrl)}" alt="${escapeHtml(settings.storeName)} Logo" />
        <p class="receipt-order-slip-title">${escapeHtml(settings.orderSlipTitle)}</p>
        <h3 class="receipt-store-name">${escapeHtml(settings.storeName)}</h3>
        <p class="receipt-store-address">${escapeHtml(settings.storeAddress)}</p>
        <p class="receipt-store-tax">${escapeHtml(settings.taxLine)}</p>
      </div>
      <div class="receipt-meta receipt-preview-draggable" data-preview-drag="meta" title="Drag to move meta details in preview">
        <div><span>Order Slip No.:</span> <strong>${escapeHtml(invoice.reference)}</strong></div>
        <div><span>Date:</span> <strong>${escapeHtml(formatDate(invoice.paidAt))}</strong></div>
        <div><span>Order Type:</span> <strong>${escapeHtml(getOrderTypeLabel(invoice.orderType))}</strong></div>
        <div><span>Payment:</span> <strong>${escapeHtml(getPaymentMethodLabel(invoice.paymentMethod))}</strong></div>
      </div>
      <div class="receipt-items receipt-preview-draggable" data-preview-drag="items" title="Drag to move item list in preview">${buildReceiptItemRows(invoice.lineItems)}</div>
      <div class="receipt-totals receipt-preview-draggable" data-preview-drag="totals" title="Drag to move totals in preview">
        <div><span>Subtotal</span><strong>${money(invoice.subtotal)}</strong></div>
        <div><span>Discount</span><strong>${money(invoice.discount)}</strong></div>
        ${settings.showDiscountProfileType && invoice.discountProfile ? `<div><span>${escapeHtml(settings.discountProfileLabel)}</span><strong>${escapeHtml(getReceiptDiscountProfileText(invoice))}</strong></div>` : ''}
        <div class="total-due"><span>Total Due</span><strong>${money(invoice.total)}</strong></div>
        <div><span>Amount Paid</span><strong>${money(invoice.payment.amountPaid)}</strong></div>
        <div><span>Change</span><strong>${money(invoice.payment.change)}</strong></div>
      </div>
      <p class="receipt-footer receipt-preview-draggable" data-preview-drag="footer" title="Drag to move footer in preview">${escapeHtml(settings.footerMessage)}</p>
      ${settings.extraMessage ? `<div class="receipt-extra-note receipt-preview-draggable" data-preview-drag="extra" title="Drag to move extra note in preview">${escapeHtml(settings.extraMessage)}</div>` : ''}
    </div>
  `;
}

function collectReceiptTemplateDraft() {
  const localLogo = getStoredReceiptTemplateLogo(state.receiptTemplateEditorId || RECEIPT_TEMPLATE_LOCAL_DRAFT_KEY);
  return normalizeReceiptTemplate({
    id: state.receiptTemplateEditorId || DEFAULT_RECEIPT_TEMPLATE.id,
    name: receiptTemplateNameInputEl?.value,
    settings: {
      orderSlipTitle: receiptTemplateOrderSlipTitleInputEl?.value,
      storeName: receiptTemplateStoreNameInputEl?.value,
      storeAddress: receiptTemplateStoreAddressInputEl?.value,
      taxLine: receiptTemplateTaxLineInputEl?.value,
      showDiscountProfileType: Boolean(receiptTemplateShowDiscountProfileInputEl?.checked),
      discountProfileLabel: receiptTemplateDiscountProfileLabelInputEl?.value,
      footerMessage: receiptTemplateFooterMessageInputEl?.value,
      extraMessage: receiptTemplateExtraMessageInputEl?.value,
      extraMessageAlign: receiptTemplateExtraMessageAlignSelectEl?.value,
      extraMessageStyle: receiptTemplateExtraMessageStyleSelectEl?.value,
      footerFontSizePx: receiptTemplateFooterFontSizeInputEl?.value,
      footerTopSpacingPx: receiptTemplateFooterTopSpacingInputEl?.value,
      headerTopPaddingPx: receiptTemplateHeaderTopPaddingInputEl?.value,
      headerOffsetX: receiptTemplateHeaderOffsetXInputEl?.value,
      headerOffsetY: receiptTemplateHeaderOffsetYInputEl?.value,
      metaOffsetX: receiptTemplateMetaOffsetXInputEl?.value,
      metaOffsetY: receiptTemplateMetaOffsetYInputEl?.value,
      itemsOffsetX: receiptTemplateItemsOffsetXInputEl?.value,
      itemsOffsetY: receiptTemplateItemsOffsetYInputEl?.value,
      totalsOffsetX: receiptTemplateTotalsOffsetXInputEl?.value,
      totalsOffsetY: receiptTemplateTotalsOffsetYInputEl?.value,
      footerOffsetX: receiptTemplateFooterOffsetXInputEl?.value,
      footerOffsetY: receiptTemplateFooterOffsetYInputEl?.value,
      extraMessageOffsetX: receiptTemplateExtraMessageOffsetXInputEl?.value,
      extraMessageOffsetY: receiptTemplateExtraMessageOffsetYInputEl?.value,
      logoUrl: localLogo || receiptTemplateLogoUrlInputEl?.value,
      showLogo: Boolean(receiptTemplateShowLogoInputEl?.checked),
      fontFamily: receiptTemplateFontFamilySelectEl?.value,
      headerAlign: receiptTemplateHeaderAlignSelectEl?.value,
      footerAlign: receiptTemplateFooterAlignSelectEl?.value,
      paperWidthMm: receiptTemplatePaperWidthInputEl?.value,
      paddingPx: receiptTemplatePaddingInputEl?.value,
      borderRadiusPx: receiptTemplateBorderRadiusInputEl?.value,
      sectionGapPx: receiptTemplateSectionGapInputEl?.value,
      baseFontSizePx: receiptTemplateBaseFontSizeInputEl?.value,
      titleFontSizePx: receiptTemplateTitleFontSizeInputEl?.value,
      metaFontSizePx: receiptTemplateMetaFontSizeInputEl?.value,
      totalFontSizePx: receiptTemplateTotalFontSizeInputEl?.value,
      logoWidthPx: receiptTemplateLogoWidthInputEl?.value,
      borderStyle: receiptTemplateBorderStyleSelectEl?.value,
      dividerStyle: receiptTemplateDividerStyleSelectEl?.value,
      textColor: receiptTemplateTextColorInputEl?.value,
      accentColor: receiptTemplateAccentColorInputEl?.value,
      mutedColor: receiptTemplateMutedColorInputEl?.value,
      backgroundColor: receiptTemplateBackgroundColorInputEl?.value,
      borderColor: receiptTemplateBorderColorInputEl?.value
    }
  });
}

function updateReceiptTemplateLogoStorageNote() {
  if (!receiptTemplateLogoStorageNoteEl) return;
  const hasLocalLogo = Boolean(getStoredReceiptTemplateLogo(state.receiptTemplateEditorId || RECEIPT_TEMPLATE_LOCAL_DRAFT_KEY));
  receiptTemplateLogoStorageNoteEl.textContent = hasLocalLogo
    ? 'A logo image is stored in this browser for this template and will be used for preview and printing.'
    : 'No local uploaded logo stored for this template yet.';
}

function setReceiptTemplatesStatus(message, tone = 'info') {
  if (!receiptTemplatesStatusEl) return;
  receiptTemplatesStatusEl.textContent = message;
  receiptTemplatesStatusEl.classList.remove('status-success', 'status-error');
  if (tone === 'success') {
    receiptTemplatesStatusEl.classList.add('status-success');
  } else if (tone === 'error') {
    receiptTemplatesStatusEl.classList.add('status-error');
  }
}

function populateReceiptTemplateEditor(template) {
  const normalized = withLocalReceiptTemplateLogo(normalizeReceiptTemplate(template || getActiveReceiptTemplate()));
  state.receiptTemplateEditorId = normalized.id || null;
  if (receiptTemplateNameInputEl) receiptTemplateNameInputEl.value = normalized.name;
  if (receiptTemplateOrderSlipTitleInputEl) receiptTemplateOrderSlipTitleInputEl.value = normalized.settings.orderSlipTitle;
  if (receiptTemplateStoreNameInputEl) receiptTemplateStoreNameInputEl.value = normalized.settings.storeName;
  if (receiptTemplateStoreAddressInputEl) receiptTemplateStoreAddressInputEl.value = normalized.settings.storeAddress;
  if (receiptTemplateTaxLineInputEl) receiptTemplateTaxLineInputEl.value = normalized.settings.taxLine;
  if (receiptTemplateShowDiscountProfileInputEl) receiptTemplateShowDiscountProfileInputEl.checked = normalized.settings.showDiscountProfileType !== false;
  if (receiptTemplateDiscountProfileLabelInputEl) receiptTemplateDiscountProfileLabelInputEl.value = normalized.settings.discountProfileLabel;
  if (receiptTemplateFooterMessageInputEl) receiptTemplateFooterMessageInputEl.value = normalized.settings.footerMessage;
  if (receiptTemplateExtraMessageInputEl) receiptTemplateExtraMessageInputEl.value = normalized.settings.extraMessage;
  if (receiptTemplateExtraMessageAlignSelectEl) receiptTemplateExtraMessageAlignSelectEl.value = normalized.settings.extraMessageAlign;
  if (receiptTemplateExtraMessageStyleSelectEl) receiptTemplateExtraMessageStyleSelectEl.value = normalized.settings.extraMessageStyle;
  if (receiptTemplateFooterFontSizeInputEl) receiptTemplateFooterFontSizeInputEl.value = normalized.settings.footerFontSizePx;
  if (receiptTemplateFooterTopSpacingInputEl) receiptTemplateFooterTopSpacingInputEl.value = normalized.settings.footerTopSpacingPx;
  if (receiptTemplateHeaderTopPaddingInputEl) receiptTemplateHeaderTopPaddingInputEl.value = normalized.settings.headerTopPaddingPx;
  if (receiptTemplateHeaderOffsetXInputEl) receiptTemplateHeaderOffsetXInputEl.value = normalized.settings.headerOffsetX;
  if (receiptTemplateHeaderOffsetYInputEl) receiptTemplateHeaderOffsetYInputEl.value = normalized.settings.headerOffsetY;
  if (receiptTemplateMetaOffsetXInputEl) receiptTemplateMetaOffsetXInputEl.value = normalized.settings.metaOffsetX;
  if (receiptTemplateMetaOffsetYInputEl) receiptTemplateMetaOffsetYInputEl.value = normalized.settings.metaOffsetY;
  if (receiptTemplateItemsOffsetXInputEl) receiptTemplateItemsOffsetXInputEl.value = normalized.settings.itemsOffsetX;
  if (receiptTemplateItemsOffsetYInputEl) receiptTemplateItemsOffsetYInputEl.value = normalized.settings.itemsOffsetY;
  if (receiptTemplateTotalsOffsetXInputEl) receiptTemplateTotalsOffsetXInputEl.value = normalized.settings.totalsOffsetX;
  if (receiptTemplateTotalsOffsetYInputEl) receiptTemplateTotalsOffsetYInputEl.value = normalized.settings.totalsOffsetY;
  if (receiptTemplateFooterOffsetXInputEl) receiptTemplateFooterOffsetXInputEl.value = normalized.settings.footerOffsetX;
  if (receiptTemplateFooterOffsetYInputEl) receiptTemplateFooterOffsetYInputEl.value = normalized.settings.footerOffsetY;
  if (receiptTemplateExtraMessageOffsetXInputEl) receiptTemplateExtraMessageOffsetXInputEl.value = normalized.settings.extraMessageOffsetX;
  if (receiptTemplateExtraMessageOffsetYInputEl) receiptTemplateExtraMessageOffsetYInputEl.value = normalized.settings.extraMessageOffsetY;
  if (receiptTemplateLogoUrlInputEl) receiptTemplateLogoUrlInputEl.value = normalized.settings.logoUrl;
  if (receiptTemplateShowLogoInputEl) receiptTemplateShowLogoInputEl.checked = normalized.settings.showLogo !== false;
  if (receiptTemplateFontFamilySelectEl) receiptTemplateFontFamilySelectEl.value = normalized.settings.fontFamily;
  if (receiptTemplateHeaderAlignSelectEl) receiptTemplateHeaderAlignSelectEl.value = normalized.settings.headerAlign;
  if (receiptTemplateFooterAlignSelectEl) receiptTemplateFooterAlignSelectEl.value = normalized.settings.footerAlign;
  if (receiptTemplatePaperWidthInputEl) receiptTemplatePaperWidthInputEl.value = normalized.settings.paperWidthMm;
  if (receiptTemplatePaddingInputEl) receiptTemplatePaddingInputEl.value = normalized.settings.paddingPx;
  if (receiptTemplateBorderRadiusInputEl) receiptTemplateBorderRadiusInputEl.value = normalized.settings.borderRadiusPx;
  if (receiptTemplateSectionGapInputEl) receiptTemplateSectionGapInputEl.value = normalized.settings.sectionGapPx;
  if (receiptTemplateBaseFontSizeInputEl) receiptTemplateBaseFontSizeInputEl.value = normalized.settings.baseFontSizePx;
  if (receiptTemplateTitleFontSizeInputEl) receiptTemplateTitleFontSizeInputEl.value = normalized.settings.titleFontSizePx;
  if (receiptTemplateMetaFontSizeInputEl) receiptTemplateMetaFontSizeInputEl.value = normalized.settings.metaFontSizePx;
  if (receiptTemplateTotalFontSizeInputEl) receiptTemplateTotalFontSizeInputEl.value = normalized.settings.totalFontSizePx;
  if (receiptTemplateLogoWidthInputEl) receiptTemplateLogoWidthInputEl.value = normalized.settings.logoWidthPx;
  if (receiptTemplateBorderStyleSelectEl) receiptTemplateBorderStyleSelectEl.value = normalized.settings.borderStyle;
  if (receiptTemplateDividerStyleSelectEl) receiptTemplateDividerStyleSelectEl.value = normalized.settings.dividerStyle;
  if (receiptTemplateTextColorInputEl) receiptTemplateTextColorInputEl.value = normalized.settings.textColor;
  if (receiptTemplateAccentColorInputEl) receiptTemplateAccentColorInputEl.value = normalized.settings.accentColor;
  if (receiptTemplateMutedColorInputEl) receiptTemplateMutedColorInputEl.value = normalized.settings.mutedColor;
  if (receiptTemplateBackgroundColorInputEl) receiptTemplateBackgroundColorInputEl.value = normalized.settings.backgroundColor;
  if (receiptTemplateBorderColorInputEl) receiptTemplateBorderColorInputEl.value = normalized.settings.borderColor;
  if (receiptTemplateLogoFileInputEl) receiptTemplateLogoFileInputEl.value = '';
  updateReceiptTemplateLogoStorageNote();
  renderReceiptTemplatePreview();
  updateReceiptTemplateEditorState();
}

function updateReceiptTemplateEditorState() {
  const canEdit = canManageReceiptTemplates();
  const selectedTemplate = state.receiptTemplates.find((template) => template.id === state.receiptTemplateEditorId) || null;
  const isSelectedActive = Boolean(selectedTemplate?.isActive);
  if (receiptTemplateAdminNoteEl) {
    receiptTemplateAdminNoteEl.textContent = canEdit
      ? 'Save new templates or activate one for all printed transaction receipts.'
      : 'You can preview order slip templates here, but only Administrations can save or activate them.';
  }
  if (receiptTemplateUpdateBtnEl) receiptTemplateUpdateBtnEl.disabled = !canEdit || !selectedTemplate;
  if (receiptTemplateActivateBtnEl) {
    receiptTemplateActivateBtnEl.disabled = !canEdit || !selectedTemplate || isSelectedActive;
    receiptTemplateActivateBtnEl.textContent = isSelectedActive
      ? 'Active for Transaction Receipts'
      : 'Use for Transaction Receipts';
  }
  if (receiptTemplateSaveNewBtnEl) receiptTemplateSaveNewBtnEl.disabled = !canEdit;
  if (receiptTemplateLogoClearBtnEl) receiptTemplateLogoClearBtnEl.disabled = !canEdit || !getStoredReceiptTemplateLogo(state.receiptTemplateEditorId || RECEIPT_TEMPLATE_LOCAL_DRAFT_KEY);
  updateReceiptTemplateLogoStorageNote();
}

function renderReceiptTemplatePreview() {
  if (!receiptTemplatePreviewAreaEl) return;
  const draft = collectReceiptTemplateDraft();
  receiptTemplatePreviewAreaEl.innerHTML = buildReceiptTemplatePreviewMarkup(draft);
  const previewAreaEl = receiptTemplatePreviewAreaEl.querySelector('.receipt-print-area');
  if (previewAreaEl) {
    applyReceiptTemplateToArea(previewAreaEl, draft);
  }
}

function getReceiptTemplateOffsetInputPair(section) {
  if (section === 'header') {
    return {
      x: receiptTemplateHeaderOffsetXInputEl,
      y: receiptTemplateHeaderOffsetYInputEl
    };
  }
  if (section === 'footer') {
    return {
      x: receiptTemplateFooterOffsetXInputEl,
      y: receiptTemplateFooterOffsetYInputEl
    };
  }
  if (section === 'meta') {
    return {
      x: receiptTemplateMetaOffsetXInputEl,
      y: receiptTemplateMetaOffsetYInputEl
    };
  }
  if (section === 'items') {
    return {
      x: receiptTemplateItemsOffsetXInputEl,
      y: receiptTemplateItemsOffsetYInputEl
    };
  }
  if (section === 'totals') {
    return {
      x: receiptTemplateTotalsOffsetXInputEl,
      y: receiptTemplateTotalsOffsetYInputEl
    };
  }
  return {
    x: receiptTemplateExtraMessageOffsetXInputEl,
    y: receiptTemplateExtraMessageOffsetYInputEl
  };
}

function updateReceiptTemplateSectionOffset(section, nextX, nextY) {
  const fields = getReceiptTemplateOffsetInputPair(section);
  if (fields.x) fields.x.value = String(clampTemplateNumber(nextX, -120, 120, 0));
  if (fields.y) fields.y.value = String(clampTemplateNumber(nextY, -80, 120, 0));
  renderReceiptTemplatePreview();
  updateReceiptTemplateEditorState();
}

function startReceiptTemplatePreviewDrag(event) {
  const dragTarget = event.target.closest('[data-preview-drag]');
  if (!dragTarget || !receiptTemplatePreviewAreaEl) return;
  const section = String(dragTarget.getAttribute('data-preview-drag') || '').trim();
  if (!section) return;
  event.preventDefault();
  const fields = getReceiptTemplateOffsetInputPair(section);
  receiptTemplatePreviewDragState = {
    section,
    startClientX: event.clientX,
    startClientY: event.clientY,
    startOffsetX: Number(fields.x?.value || 0),
    startOffsetY: Number(fields.y?.value || 0)
  };
  document.body.classList.add('receipt-template-dragging');
}

function continueReceiptTemplatePreviewDrag(event) {
  if (!receiptTemplatePreviewDragState) return;
  event.preventDefault();
  const dx = event.clientX - receiptTemplatePreviewDragState.startClientX;
  const dy = event.clientY - receiptTemplatePreviewDragState.startClientY;
  updateReceiptTemplateSectionOffset(
    receiptTemplatePreviewDragState.section,
    receiptTemplatePreviewDragState.startOffsetX + dx,
    receiptTemplatePreviewDragState.startOffsetY + dy
  );
}

function stopReceiptTemplatePreviewDrag() {
  if (!receiptTemplatePreviewDragState) return;
  receiptTemplatePreviewDragState = null;
  document.body.classList.remove('receipt-template-dragging');
}

function renderReceiptTemplateList() {
  if (!receiptTemplateListEl) return;
  if (!state.receiptTemplates.length) {
    receiptTemplateListEl.innerHTML = '<p>No saved order slip templates yet.</p>';
    return;
  }

  const rows = state.receiptTemplates.map((template) => {
    const normalized = withLocalReceiptTemplateLogo(normalizeReceiptTemplate(template));
    const isSelected = normalized.id === state.receiptTemplateEditorId;
    const fontLabel = normalized.settings.fontFamily.split(',')[0].replace(/['"]/g, '');
    const hasLocalLogo = Boolean(getStoredReceiptTemplateLogo(normalized.id));
    const canActivate = canManageReceiptTemplates() && !normalized.isActive;
    return `
      <article class="receipt-template-list-card${isSelected ? ' selected' : ''}">
        <div class="receipt-template-list-head">
          <div>
            <strong>${escapeHtml(normalized.name)}</strong>
            <small>${normalized.isActive ? 'Currently used for transaction printing' : 'Saved template'}${hasLocalLogo ? ' • local logo uploaded' : ''}</small>
          </div>
          ${normalized.isActive ? '<span class="receipt-template-active-badge">Active</span>' : ''}
        </div>
        <div class="receipt-template-list-meta">
          <span>${escapeHtml(String(normalized.settings.paperWidthMm))}mm</span>
          <span>${escapeHtml(normalized.settings.headerAlign)} header</span>
          <span>${escapeHtml(fontLabel)}</span>
        </div>
        <div class="receipt-template-list-actions">
          <button class="secondary small" type="button" data-receipt-template-load="${escapeHtml(normalized.id)}">Load</button>
          <button class="secondary small" type="button" data-receipt-template-activate="${escapeHtml(normalized.id)}"${canActivate ? '' : ' disabled'}>${normalized.isActive ? 'Active Template' : 'Use for Order Slips'}</button>
          <button class="secondary small" type="button" data-receipt-template-delete="${escapeHtml(normalized.id)}"${canManageReceiptTemplates() && !normalized.isActive ? '' : ' disabled'}>Delete</button>
        </div>
      </article>
    `;
  }).join('');

  receiptTemplateListEl.innerHTML = rows;
}

function applyReceiptTemplatesState(payload = {}) {
  if (Array.isArray(payload?.templates)) {
    state.receiptTemplates = payload.templates.map(normalizeReceiptTemplate);
  }
  if (payload?.activeReceiptTemplate) {
    const activeTemplate = normalizeReceiptTemplate(payload.activeReceiptTemplate);
    state.activeReceiptTemplate = activeTemplate;
    if (state.receiptTemplates.length) {
      state.receiptTemplates = state.receiptTemplates.map((template) => ({
        ...normalizeReceiptTemplate(template),
        isActive: template.id === activeTemplate.id
      }));
    } else {
      state.receiptTemplates = [{ ...activeTemplate, isActive: true }];
    }
  } else if (state.receiptTemplates.length) {
    state.activeReceiptTemplate = normalizeReceiptTemplate(
      state.receiptTemplates.find((template) => template.isActive) || state.receiptTemplates[0]
    );
  } else {
    state.activeReceiptTemplate = normalizeReceiptTemplate(DEFAULT_RECEIPT_TEMPLATE);
  }

  applyActiveReceiptTemplate();
  renderReceiptTemplateList();
  const selectedTemplate = state.receiptTemplates.find((template) => template.id === state.receiptTemplateEditorId);
  populateReceiptTemplateEditor(selectedTemplate || state.activeReceiptTemplate);
  const statusMessage = typeof payload?.statusMessage === 'string' && payload.statusMessage.trim()
    ? payload.statusMessage.trim()
    : `Active template: ${state.activeReceiptTemplate.name}. ${state.receiptTemplates.length || 1} saved template(s).`;
  setReceiptTemplatesStatus(statusMessage, payload?.statusTone);
}

async function refreshReceiptTemplatesModule() {
  if (!receiptTemplatesStatusEl || !canAccessReceiptTemplatesPanel()) return;
  setReceiptTemplatesStatus('Loading order slip templates...');
  if (receiptTemplateListEl) receiptTemplateListEl.innerHTML = '<p>Loading templates...</p>';
  try {
    const result = await api('/api/admin/receipt-templates', {
      headers: buildActorHeaders()
    });
    applyReceiptTemplatesState({
      templates: result?.templates,
      activeReceiptTemplate: result?.activeReceiptTemplate
    });
  } catch (error) {
    setReceiptTemplatesStatus(`Receipt template error: ${error.message}`, 'error');
    if (receiptTemplateListEl) receiptTemplateListEl.innerHTML = '';
  }
}

function renderReceipt(invoice) {
  const normalizedStatus = String(invoice?.status || '').trim().toUpperCase();
  const successText = normalizedStatus === 'HOLD_FOR_VOID'
    ? 'Payment completed and placed on hold for admin void review'
    : invoice?.payment?.successMessage || (normalizedStatus === 'PAID' ? 'Payment Successful' : 'Payment Pending');
  const itemRows = (invoice.lineItems || [])
    .map((item) => `
      <div class="status-item-row">
        <span>${escapeHtml(item.name)} x ${item.qty}</span>
        <strong>${money(item.subtotal)}</strong>
      </div>
    `)
    .join('');
  const orderLabel = invoice?.orderType ? getOrderTypeLabel(invoice.orderType) : getOrderTypeLabel(state.orderType);
  const paidAtText = formatDate(invoice?.payment?.paidAt || invoice?.updatedAt || invoice?.createdAt || new Date().toISOString());
  const statusBadgeClass = normalizedStatus === 'PAID'
    ? 'paid'
    : normalizedStatus === 'HOLD_FOR_VOID'
      ? 'hold-void'
      : '';
  const lifecycleNote = (normalizedStatus === 'HOLD_FOR_VOID' || normalizedStatus === 'VOIDED' || normalizedStatus === 'CANCELLED')
    ? `<div class="status-paid-at">${escapeHtml(getOverviewMixLabel(normalizedStatus))}${invoice?.statusReason ? `: ${escapeHtml(invoice.statusReason)}` : ''}</div>`
    : '';

  statusEl.classList.add('invoice-status');
  statusEl.innerHTML = `
    <div class="status-head">
      <div class="status-ref">Invoice: ${escapeHtml(invoice.reference || '-')}</div>
      <div class="status-badge ${statusBadgeClass}">${escapeHtml(getOverviewMixLabel(normalizedStatus) || invoice.status || '-')}</div>
    </div>
    <div class="status-grid">
      <div class="status-grid-row"><span>Order</span><strong>${escapeHtml(orderLabel)}</strong></div>
      <div class="status-grid-row"><span>Payment</span><strong>${escapeHtml(getPaymentMethodLabel(invoice.paymentMethod))}</strong></div>
      <div class="status-grid-row"><span>Result</span><strong>${escapeHtml(successText)}</strong></div>
    </div>
    <div class="status-items">${itemRows || '<div class="status-item-row"><span>No items</span><strong>-</strong></div>'}</div>
    <div class="status-totals">
      <div class="status-total-row"><span>Subtotal</span><strong>${money(invoice.subtotal ?? invoice.total)}</strong></div>
      <div class="status-total-row"><span>Discount</span><strong>${money(invoice.discount || 0)}</strong></div>
      <div class="status-total-row grand"><span>Total Due</span><strong>${money(invoice.total)}</strong></div>
      <div class="status-total-row"><span>Paid</span><strong>${money(invoice?.payment?.amountPaid || invoice.total || 0)}</strong></div>
      <div class="status-total-row"><span>Change</span><strong>${money(invoice?.payment?.change || 0)}</strong></div>
    </div>
    <div class="status-paid-at">Paid At: ${escapeHtml(paidAtText)}</div>
    ${lifecycleNote}
  `;
  updateReceiptActionVisibility();
}

function renderPaymentReceiptModal(invoice) {
  const orderLabel = invoice?.orderType
    ? getOrderTypeLabel(invoice.orderType)
    : getOrderTypeLabel(state.orderType);
  const paymentLabel = getPaymentMethodLabel(invoice.paymentMethod);
  const paidAt = invoice?.payment?.paidAt || new Date().toISOString();
  const itemRows = buildReceiptItemRows(invoice.lineItems || []);

  if (receiptRefEl) receiptRefEl.textContent = invoice.reference;
  if (receiptDateEl) receiptDateEl.textContent = formatDate(paidAt);
  if (receiptOrderTypeEl) receiptOrderTypeEl.textContent = orderLabel;
  if (receiptPaymentMethodEl) receiptPaymentMethodEl.textContent = paymentLabel;
  if (receiptItemsEl) receiptItemsEl.innerHTML = itemRows;
  if (receiptSubtotalEl) receiptSubtotalEl.textContent = money(invoice.subtotal ?? invoice.total);
  if (receiptDiscountEl) receiptDiscountEl.textContent = money(invoice.discount || 0);
  if (receiptTotalDueEl) receiptTotalDueEl.textContent = money(invoice.total || 0);
  if (receiptAmountPaidEl) receiptAmountPaidEl.textContent = money(invoice?.payment?.amountPaid || invoice.total || 0);
  if (receiptChangeEl) receiptChangeEl.textContent = money(invoice?.payment?.change || 0);
  applyActiveReceiptTemplate();
  applyReceiptDiscountProfileLine(getActiveReceiptTemplate(), invoice, {
    rowEl: receiptDiscountProfileRowEl,
    labelEl: receiptDiscountProfileLabelEl,
    valueEl: receiptDiscountProfileValueEl
  });
}

function renderAdminReceiptModal(invoice) {
  const paidAt = invoice?.payment?.paidAt || invoice?.updatedAt || invoice?.createdAt || new Date().toISOString();
  const orderLabel = invoice?.orderType ? getOrderTypeLabel(invoice.orderType) : 'N/A';
  const paymentLabel = getPaymentMethodLabel(invoice.paymentMethod);
  const itemRows = buildReceiptItemRows(invoice.lineItems || []);

  if (adminReceiptRefEl) adminReceiptRefEl.textContent = invoice.reference || '-';
  if (adminReceiptDateEl) adminReceiptDateEl.textContent = formatDate(paidAt);
  if (adminReceiptOrderTypeEl) adminReceiptOrderTypeEl.textContent = orderLabel;
  if (adminReceiptPaymentMethodEl) adminReceiptPaymentMethodEl.textContent = paymentLabel;
  if (adminReceiptItemsEl) adminReceiptItemsEl.innerHTML = itemRows || '<div class="receipt-item-row"><span>No items found</span><strong>-</strong></div>';
  if (adminReceiptSubtotalEl) adminReceiptSubtotalEl.textContent = money(invoice.subtotal ?? invoice.total ?? 0);
  if (adminReceiptDiscountEl) adminReceiptDiscountEl.textContent = money(invoice.discount || 0);
  if (adminReceiptTotalDueEl) adminReceiptTotalDueEl.textContent = money(invoice.total || 0);
  if (adminReceiptAmountPaidEl) adminReceiptAmountPaidEl.textContent = money(invoice?.payment?.amountPaid || invoice.total || 0);
  if (adminReceiptChangeEl) adminReceiptChangeEl.textContent = money(invoice?.payment?.change || 0);
  applyActiveReceiptTemplate();
  applyReceiptDiscountProfileLine(getActiveReceiptTemplate(), invoice, {
    rowEl: adminReceiptDiscountProfileRowEl,
    labelEl: adminReceiptDiscountProfileLabelEl,
    valueEl: adminReceiptDiscountProfileValueEl
  });
}

function finalizeSuccessfulPayment(invoice, modeLabel) {
  state.lastPaidInvoice = invoice;
  updateReceiptActionVisibility();
  state.cashPromptActive = false;
  if (amountTenderedEl) amountTenderedEl.value = '';
  resetAfterSale();
}

function closePaymentSuccessModal() {
  if (paymentSuccessModalEl) paymentSuccessModalEl.classList.remove('open');
  const receiptCardEl = paymentSuccessModalEl?.querySelector('.payment-success-card');
  if (receiptCardEl) receiptCardEl.classList.remove('collapsed');
  if (receiptCardEl) receiptCardEl.classList.remove('minimizing');
  if (receiptCardEl) receiptCardEl.style.transform = '';
  if (receiptCardEl) receiptCardEl.style.opacity = '';
  if (receiptMinimizeBtn) receiptMinimizeBtn.textContent = 'Minimize';
}

function printReceiptContent(printAreaEl) {
  if (!printAreaEl) return;
  const printWindow = window.open('', '_blank', 'width=420,height=780');
  if (!printWindow) {
    setStatus('Pop-up blocked. Please allow pop-ups to print receipt.');
    return;
  }

  const receiptHtml = printAreaEl.outerHTML;
  const printStyles = `
    <style>
      body { margin: 0; padding: 8px; background: #ffffff; }
      .receipt-print-area {
        width: var(--receipt-paper-width, 80mm);
        margin: 0 auto;
        border: 1px var(--receipt-border-style, dashed) var(--receipt-border-color, #c8a88f);
        border-radius: var(--receipt-radius, 12px);
        padding: var(--receipt-padding, 12px);
        background: var(--receipt-background, #ffffff);
        color: var(--receipt-text-color, #432716);
        font-family: var(--receipt-font-family, Arial, sans-serif);
        font-size: var(--receipt-base-font-size, 13px);
        box-sizing: border-box;
      }
      .receipt-header {
        text-align: var(--receipt-header-align, center);
        border-bottom: 1px var(--receipt-divider-style, dashed) var(--receipt-border-color, #c8a88f);
        padding-top: var(--receipt-header-top-padding, 0px);
        padding-bottom: var(--receipt-section-gap, 10px);
        margin-bottom: var(--receipt-section-gap, 10px);
        transform: translate(var(--receipt-header-offset-x, 0px), var(--receipt-header-offset-y, 0px));
      }
      .receipt-logo { width: var(--receipt-logo-width, 78px); height: auto; object-fit: contain; margin-bottom: 6px; }
      .receipt-print-area.logo-hidden .receipt-logo { display: none !important; }
      .receipt-header h3 { margin: 0; font-size: var(--receipt-title-size, 24px); font-weight: 800; color: var(--receipt-accent-color, #5a3521); }
      .receipt-order-slip-title {
        margin: 0 0 2px;
        font-size: var(--receipt-meta-size, 12px);
        color: var(--receipt-accent-color, #5a3521);
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }
      .receipt-header p { margin: 2px 0; font-size: var(--receipt-meta-size, 12px); color: var(--receipt-muted-color, #7b5a47); white-space: pre-line; }
      .receipt-meta { display: grid; gap: 4px; margin-bottom: var(--receipt-section-gap, 10px); font-size: var(--receipt-meta-size, 12px); transform: translate(var(--receipt-meta-offset-x, 0px), var(--receipt-meta-offset-y, 0px)); }
      .receipt-meta div { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px dotted var(--receipt-border-color, #c8a88f); padding-bottom: 2px; }
      .receipt-items {
        border-top: 1px var(--receipt-divider-style, dashed) var(--receipt-border-color, #c8a88f);
        border-bottom: 1px var(--receipt-divider-style, dashed) var(--receipt-border-color, #c8a88f);
        padding: 8px 0;
        margin: var(--receipt-section-gap, 10px) 0;
        transform: translate(var(--receipt-items-offset-x, 0px), var(--receipt-items-offset-y, 0px));
      }
      .receipt-item-row { display: flex; justify-content: space-between; align-items: baseline; font-size: inherit; margin: 4px 0; gap: 8px; }
      .receipt-item-row strong { white-space: nowrap; }
      .receipt-totals { display: grid; gap: 4px; transform: translate(var(--receipt-totals-offset-x, 0px), var(--receipt-totals-offset-y, 0px)); }
      .receipt-totals div { display: flex; justify-content: space-between; font-size: inherit; }
      .receipt-totals .total-due {
        margin-top: 4px;
        padding-top: 6px;
        border-top: 1px solid var(--receipt-border-color, #c8a88f);
        font-size: var(--receipt-total-size, 16px);
        font-weight: 800;
        color: var(--receipt-accent-color, #5a3521);
      }
      .receipt-footer {
        margin-top: var(--receipt-footer-top-spacing, 12px);
        text-align: var(--receipt-footer-align, center);
        font-size: var(--receipt-footer-size, 12px);
        font-weight: 700;
        color: var(--receipt-accent-color, #7a4a2d);
        white-space: pre-line;
        transform: translate(var(--receipt-footer-offset-x, 0px), var(--receipt-footer-offset-y, 0px));
      }
      .receipt-extra-note {
        margin-top: calc(var(--receipt-section-gap, 10px) - 2px);
        padding: 8px 10px;
        border: 1px var(--receipt-extra-note-style, dashed) var(--receipt-border-color, #c8a88f);
        border-radius: calc(var(--receipt-radius, 12px) * 0.7);
        text-align: var(--receipt-extra-note-align, center);
        font-size: var(--receipt-meta-size, 12px);
        font-weight: 600;
        line-height: 1.45;
        color: var(--receipt-text-color, #432716);
        white-space: pre-line;
        transform: translate(var(--receipt-extra-note-offset-x, 0px), var(--receipt-extra-note-offset-y, 0px));
      }
    </style>
  `;

  printWindow.document.open();
  printWindow.document.write(`
    <!doctype html>
    <html>
      <head><meta charset="utf-8" /><title>Receipt</title>${printStyles}</head>
      <body>${receiptHtml}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    setTimeout(() => printWindow.close(), 200);
  }, 120);
}

function printReceiptFromModal() {
  printReceiptContent(receiptPrintAreaEl);
}

function openLatestReceiptPreview() {
  if (!state.lastPaidInvoice) {
    setStatus('No paid transaction yet to preview receipt.');
    return;
  }
  renderPaymentReceiptModal(state.lastPaidInvoice);
  if (paymentSuccessModalEl) paymentSuccessModalEl.classList.add('open');
}

function togglePaymentReceiptCollapse() {
  const receiptCardEl = paymentSuccessModalEl?.querySelector('.payment-success-card');
  const targetBtn = statusPrintReceiptBtn;
  if (!receiptCardEl || !receiptMinimizeBtn) return;

  if (receiptMinimizeBtn.textContent === 'Minimize' && paymentSuccessModalEl?.classList.contains('open')) {
    if (!targetBtn) return;
    const cardRect = receiptCardEl.getBoundingClientRect();
    const targetRect = targetBtn.getBoundingClientRect();
    const dx = (targetRect.left + (targetRect.width / 2)) - (cardRect.left + (cardRect.width / 2));
    const dy = (targetRect.top + (targetRect.height / 2)) - (cardRect.top + (cardRect.height / 2));

    receiptCardEl.classList.add('minimizing');
    receiptCardEl.style.transform = `translate(${dx}px, ${dy}px) scale(0.2)`;
    receiptCardEl.style.opacity = '0.15';
    receiptMinimizeBtn.textContent = 'Expand';

    setTimeout(() => {
      if (paymentSuccessModalEl) paymentSuccessModalEl.classList.remove('open');
      receiptCardEl.classList.remove('minimizing');
      receiptCardEl.style.transform = '';
      receiptCardEl.style.opacity = '';
      if (receiptMinimizeBtn) receiptMinimizeBtn.textContent = 'Minimize';
    }, 360);
    return;
  }

  const collapsed = !receiptCardEl.classList.contains('collapsed');
  receiptCardEl.classList.toggle('collapsed', collapsed);
  receiptMinimizeBtn.textContent = collapsed ? 'Expand' : 'Minimize';
}

function printAdminReceiptFromModal() {
  printReceiptContent(adminReceiptPrintAreaEl);
}

function openAdminReceiptModal() {
  if (adminReceiptModalEl) adminReceiptModalEl.classList.add('open');
}

function closeAdminReceiptModal() {
  if (adminReceiptModalEl) adminReceiptModalEl.classList.remove('open');
}

function openEwalletModal() {
  if (!eWalletModalEl) return;
  eWalletModalEl.classList.add('open');
}

function closeEwalletModal() {
  if (!eWalletModalEl) return;
  eWalletModalEl.classList.remove('open');
}

function openScanQrModal() {
  if (!scanQrModalEl) return;
  scanQrModalEl.classList.add('open');
}

function closeScanQrModal() {
  if (!scanQrModalEl) return;
  scanQrModalEl.classList.remove('open');
}

function renderScanQrContent({ checkout, invoice, notice = 'Waiting for payment confirmation...' }) {
  if (!scanQrContentEl) return;
  const sampleQrDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
      <rect width="220" height="220" fill="white"/>
      <rect x="12" y="12" width="56" height="56" fill="black"/>
      <rect x="20" y="20" width="40" height="40" fill="white"/>
      <rect x="28" y="28" width="24" height="24" fill="black"/>
      <rect x="152" y="12" width="56" height="56" fill="black"/>
      <rect x="160" y="20" width="40" height="40" fill="white"/>
      <rect x="168" y="28" width="24" height="24" fill="black"/>
      <rect x="12" y="152" width="56" height="56" fill="black"/>
      <rect x="20" y="160" width="40" height="40" fill="white"/>
      <rect x="28" y="168" width="24" height="24" fill="black"/>
      <rect x="84" y="84" width="8" height="8" fill="black"/>
      <rect x="100" y="84" width="8" height="8" fill="black"/>
      <rect x="116" y="84" width="8" height="8" fill="black"/>
      <rect x="132" y="84" width="8" height="8" fill="black"/>
      <rect x="84" y="100" width="8" height="8" fill="black"/>
      <rect x="116" y="100" width="8" height="8" fill="black"/>
      <rect x="132" y="100" width="8" height="8" fill="black"/>
      <rect x="84" y="116" width="8" height="8" fill="black"/>
      <rect x="100" y="116" width="8" height="8" fill="black"/>
      <rect x="132" y="116" width="8" height="8" fill="black"/>
      <rect x="84" y="132" width="8" height="8" fill="black"/>
      <rect x="100" y="132" width="8" height="8" fill="black"/>
      <rect x="116" y="132" width="8" height="8" fill="black"/>
      <rect x="132" y="132" width="8" height="8" fill="black"/>
      <text x="110" y="212" text-anchor="middle" font-size="11" font-family="Arial" fill="#5a3521">Sample QR for Scan-to-Pay</text>
    </svg>
  `)}`;
  const qrMarkup = `<img class="qr" alt="Sample Payment QR Code" src="${sampleQrDataUrl}" />`;

  scanQrContentEl.innerHTML = `
    <div class="scan-qr-meta">
      <div><strong>Reference:</strong> ${escapeHtml(checkout?.reference || invoice?.reference || '-')}</div>
      <div><strong>Amount:</strong> ${money(invoice?.total || checkout?.amount || 0)}</div>
      <div><strong>Method:</strong> ${escapeHtml(getPaymentMethodLabel(invoice?.paymentMethod || checkout?.method || 'gcash'))}</div>
      <div><strong>Status:</strong> ${escapeHtml(notice)}</div>
    </div>
    ${qrMarkup}
  `;
}

async function startScanQrPaymentFlow() {
  try {
    const items = getCartItems();
    if (!items.length) {
      setStatus('Add at least one item first.');
      return;
    }

    const { invoice } = await api('/api/invoices', {
      method: 'POST',
      body: JSON.stringify({
        items,
        paymentMethod: 'gcash',
        discountAmount: getDiscountAmount(),
        discountProfile: normalizeInvoiceDiscountProfile(getSelectedDiscountProfile()),
        orderType: state.orderType,
        ...getCashierInvoiceContext()
      })
    });

    state.activeInvoice = invoice;

    const customerInfo = {};
    const cName = (customerNameEl?.value || '').trim();
    const cEmail = (customerEmailEl?.value || '').trim();
    const cPhone = (customerPhoneEl?.value || '').trim();
    if (cName) customerInfo.name = cName;
    if (cEmail) customerInfo.email = cEmail;
    if (cPhone) customerInfo.phone = cPhone;

    const { checkout } = await api('/api/payments/ewallet/checkout', {
      method: 'POST',
      body: JSON.stringify({ invoiceId: invoice.id, customerInfo })
    });

    state.scanQrContext = {
      invoiceId: invoice.id,
      invoice,
      checkout
    };

    renderScanQrContent({ checkout, invoice, notice: 'Waiting for customer proof of payment...' });
    if (scanQrFinishBtn) scanQrFinishBtn.disabled = false;
    openScanQrModal();
    setStatus('Sample QR is ready. Ask customer to scan and pay, then confirm proof and click Finish.');
  } catch (error) {
    setStatus(`QR checkout error: ${error.message}`);
  }
}

async function finishScanQrPayment() {
  if (!state.scanQrContext?.invoiceId) {
    setStatus('No active QR payment session.');
    return;
  }

  let paidInvoice = null;
  try {
    const completeResult = await api(`/api/payments/ewallet/manual-complete/${state.scanQrContext.invoiceId}`, {
      method: 'POST'
    });
    paidInvoice = completeResult?.invoice || null;
  } catch (error) {
    setStatus(`Cannot complete payment: ${error.message}`);
    return;
  }
  if (!paidInvoice) return;

  closeScanQrModal();
  renderReceipt(paidInvoice);
  await refreshSalesReport(activeSalesRange);
  finalizeSuccessfulPayment(paidInvoice, 'E-Payment');
  state.scanQrContext = null;
}

function formatOverviewDelta(comparison, formatter = money) {
  const delta = Number(comparison?.delta || 0);
  const percent = Number(comparison?.percentChange || 0);
  const direction = String(comparison?.direction || 'flat');
  const sign = delta > 0 ? '+' : '';
  const percentSign = percent > 0 ? '+' : '';
  if (direction === 'flat') return 'No change vs previous range';
  return `${sign}${formatter(delta)} | ${percentSign}${percent.toFixed(2)}% vs previous range`;
}

function formatOverviewCountDelta(comparison) {
  const delta = Number(comparison?.delta || 0);
  const percent = Number(comparison?.percentChange || 0);
  const direction = String(comparison?.direction || 'flat');
  const sign = delta > 0 ? '+' : '';
  const percentSign = percent > 0 ? '+' : '';
  if (direction === 'flat') return 'No change vs previous range';
  return `${sign}${delta} | ${percentSign}${percent.toFixed(2)}% vs previous range`;
}

function getOverviewMixLabel(value, fallback = 'Unknown') {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return fallback;
  if (normalized === 'gcash' || normalized === 'paymaya' || normalized === 'cash') {
    return getPaymentMethodLabel(normalized);
  }
  if (normalized === 'dine-in' || normalized === 'take-out') {
    return getOrderTypeLabel(normalized);
  }
  if (normalized === 'pending') return 'Pending';
  if (normalized === 'paid') return 'Paid';
  if (normalized === 'hold_for_void') return 'Hold for Void';
  if (normalized === 'cancelled') return 'Cancelled';
  if (normalized === 'voided') return 'Voided';
  return normalized.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function renderOverviewMixRows(rows, type) {
  return rows.length
    ? rows.map((row) => `
        <div class="overview-mix-row">
          <div>
            <strong>${escapeHtml(getOverviewMixLabel(type === 'payment' ? row.method : type === 'order' ? row.orderType : row.status))}</strong>
            <small>${Number(row.count || 0)} transaction(s)</small>
          </div>
          <div class="overview-mix-meta">
            <span>${type === 'status' ? money(row.amount || 0) : `${Number(row.share || 0).toFixed(1)}%`}</span>
            ${type === 'status' ? '' : `<small>${money(row.amount || 0)}</small>`}
          </div>
        </div>
      `).join('')
    : '<p>No data for this range.</p>';
}

function renderOverviewMetricCards(report) {
  const metrics = report?.metrics || {};
  const comparisons = report?.comparisons || {};
  return `
    <div class="overview-kpi-grid">
      <article class="overview-kpi-card highlight">
        <span>Gross Sales</span>
        <strong>${money(metrics.totalSales || 0)}</strong>
        <small>${formatOverviewDelta(comparisons.sales, money)}</small>
      </article>
      <article class="overview-kpi-card">
        <span>Paid Transactions</span>
        <strong>${Number(metrics.paidTransactions || 0)}</strong>
        <small>${formatOverviewCountDelta(comparisons.transactions)}</small>
      </article>
      <article class="overview-kpi-card">
        <span>Average Ticket</span>
        <strong>${money(metrics.averageTicket || 0)}</strong>
        <small>${formatOverviewDelta(comparisons.averageTicket, money)}</small>
      </article>
      <article class="overview-kpi-card">
        <span>Items Sold</span>
        <strong>${Number(metrics.itemsSold || 0)}</strong>
        <small>${formatOverviewCountDelta(comparisons.itemsSold)}</small>
      </article>
      <article class="overview-kpi-card">
        <span>Net Cash</span>
        <strong>${money(metrics.netCash || 0)}</strong>
        <small>Tendered ${money(metrics.cashTendered || 0)} | Change ${money(metrics.changeGiven || 0)}</small>
      </article>
      <article class="overview-kpi-card">
        <span>Monthly Net After Expenses</span>
        <strong>${money(metrics.monthlyNetAfterExpenses || 0)}</strong>
        <small>Monthly expenses ${money(metrics.monthlyExpenses || 0)}</small>
      </article>
    </div>
  `;
}

function renderOverviewMixSection(report) {
  const paymentMix = Array.isArray(report?.paymentMix) ? report.paymentMix : [];
  const orderTypeMix = Array.isArray(report?.orderTypeMix) ? report.orderTypeMix : [];

  return `
    <section class="overview-panel-card admin-mix-panel-card">
      <div class="overview-panel-head">
        <h3>Payment and Order Mix</h3>
        <span>Selected dashboard range</span>
      </div>
      <div class="admin-mix-grid">
        <section class="admin-mix-column">
          <div class="admin-mix-column-head">
            <h4>Payment Mix</h4>
            <span>Cash and e-wallet share</span>
          </div>
          <div class="overview-mix-list">${renderOverviewMixRows(paymentMix, 'payment')}</div>
        </section>
        <section class="admin-mix-column">
          <div class="admin-mix-column-head">
            <h4>Order Type Mix</h4>
            <span>Dine in vs take out</span>
          </div>
          <div class="overview-mix-list">${renderOverviewMixRows(orderTypeMix, 'order')}</div>
        </section>
      </div>
    </section>
  `;
}

function setAdminMixPanelVisibility(nextOpen) {
  isAdminMixPanelOpen = Boolean(nextOpen);
  if (adminMixSectionEl) {
    adminMixSectionEl.classList.toggle('hidden-control', !isAdminMixPanelOpen);
  }
  if (adminTransactionsGroupHeadEl) {
    adminTransactionsGroupHeadEl.classList.toggle('hidden-control', isAdminMixPanelOpen);
  }
  if (adminTransactionsRowEl) {
    adminTransactionsRowEl.classList.toggle('hidden-control', isAdminMixPanelOpen);
  }
  if (adminMixToggleBtn) {
    adminMixToggleBtn.textContent = 'Comparison';
    adminMixToggleBtn.setAttribute('aria-expanded', String(isAdminMixPanelOpen));
  }
}

function renderOverviewDetailSection(report) {
  const peakHour = report?.highlights?.peakHour || null;
  const monthly = report?.monthlyClosing?.summary || {};
  const inventory = report?.inventory || {};
  const hourlySales = Array.isArray(report?.hourlySales) ? report.hourlySales : [];
  const weekdaySales = Array.isArray(report?.weekdaySales) ? report.weekdaySales : [];
  const bestSalesDay = weekdaySales.reduce((best, row) => {
    return Number(row?.totalSales || 0) > Number(best?.totalSales || 0) ? row : best;
  }, null);
  const busiestDay = weekdaySales.reduce((best, row) => {
    return Number(row?.transactions || 0) > Number(best?.transactions || 0) ? row : best;
  }, null);
  const hourlyMax = Math.max(...hourlySales.map((row) => Number(row?.totalSales || 0)), 0);
  const weekdayMax = Math.max(...weekdaySales.map((row) => Number(row?.totalSales || 0)), 0);
  const populatedHourlySales = hourlySales.filter((row) => Number(row?.totalSales || 0) > 0 || Number(row?.transactions || 0) > 0);
  const populatedWeekdaySales = weekdaySales.filter((row) => Number(row?.totalSales || 0) > 0 || Number(row?.transactions || 0) > 0);
  const hourlyTrendMarkup = populatedHourlySales.length
    ? populatedHourlySales
      .slice(0, 8)
      .map((row) => {
        const percent = hourlyMax > 0 ? Math.max(8, Math.round((Number(row?.totalSales || 0) / hourlyMax) * 100)) : 0;
        return `
          <div class="overview-trend-row">
            <div class="overview-trend-copy">
              <strong>${escapeHtml(row?.label || '—')}</strong>
              <small>${Number(row?.transactions || 0)} paid transaction(s)</small>
            </div>
            <div class="overview-trend-meta">
              <span>${money(row?.totalSales || 0)}</span>
              <div class="overview-trend-meter"><span style="width:${percent}%;"></span></div>
            </div>
          </div>
        `;
      }).join('')
    : '<p>No hourly sales data for this range.</p>';
  const weekdayTrendMarkup = populatedWeekdaySales.length
    ? populatedWeekdaySales
      .map((row) => {
        const percent = weekdayMax > 0 ? Math.max(8, Math.round((Number(row?.totalSales || 0) / weekdayMax) * 100)) : 0;
        return `
          <div class="overview-trend-row">
            <div class="overview-trend-copy">
              <strong>${escapeHtml(row?.fullLabel || row?.label || '—')}</strong>
              <small>${Number(row?.transactions || 0)} paid transaction(s)</small>
            </div>
            <div class="overview-trend-meta">
              <span>${money(row?.totalSales || 0)}</span>
              <div class="overview-trend-meter"><span style="width:${percent}%;"></span></div>
            </div>
          </div>
        `;
      }).join('')
    : '<p>No weekday sales data for this range.</p>';
  return `
    <div class="overview-detail-stack">
      <div class="overview-detail-grid">
        <article class="overview-detail-card">
          <span>Peak Hour</span>
          <strong>${escapeHtml(peakHour?.label || '—')}</strong>
          <small>${money(peakHour?.totalSales || 0)} across ${Number(peakHour?.transactions || 0)} transaction(s)</small>
        </article>
        <article class="overview-detail-card">
          <span>Best Sales Day</span>
          <strong>${escapeHtml(bestSalesDay?.fullLabel || '—')}</strong>
          <small>${money(bestSalesDay?.totalSales || 0)} in paid sales for the selected range</small>
        </article>
        <article class="overview-detail-card">
          <span>Busiest Day</span>
          <strong>${escapeHtml(busiestDay?.fullLabel || '—')}</strong>
          <small>${Number(busiestDay?.transactions || 0)} paid transaction(s)</small>
        </article>
        <article class="overview-detail-card">
          <span>Inventory Snapshot</span>
          <strong>${money(inventory?.totals?.totalInventoryValue || 0)}</strong>
          <small>${Number(inventory?.totals?.lowStockCount || 0)} low-stock ingredient(s)</small>
        </article>
      </div>
      <div class="overview-analysis-grid">
        <section class="overview-panel-card">
          <div class="overview-panel-head">
            <h3>Hourly Trend</h3>
            <span>Paid sales by hour</span>
          </div>
          <div class="overview-trend-list">${hourlyTrendMarkup}</div>
        </section>
        <section class="overview-panel-card">
          <div class="overview-panel-head">
            <h3>Weekday Trend</h3>
            <span>Sales performance by day</span>
          </div>
          <div class="overview-trend-list">${weekdayTrendMarkup}</div>
        </section>
        <article class="overview-detail-card">
          <span>Monthly Expenses</span>
          <strong>${money(monthly.totalExpenses || 0)}</strong>
          <small>${Number(monthly.expenseCount || 0)} expense entry(s) logged this month</small>
        </article>
        <article class="overview-detail-card">
          <span>Drawer Withdrawals</span>
          <strong>${money(monthly.drawerWithdrawals || 0)}</strong>
          <small>Shift discrepancies ${money(monthly.totalDiscrepancy || 0)}</small>
        </article>
      </div>
    </div>
  `;
}

function renderOverviewTopLists(report) {
  const topProducts = Array.isArray(report?.topProducts) ? report.topProducts : [];

  const topProductsMarkup = topProducts.length
    ? topProducts.map((item) => `
        <div class="overview-list-row">
          <div>
            <strong>${escapeHtml(item.productName || 'Product')}</strong>
            <small>${Number(item.qtySold || 0)} sold</small>
          </div>
          <span>${money(item.totalSales || 0)}</span>
        </div>
      `).join('')
    : '<p>No product sales yet for this range.</p>';

  return `
    <div class="overview-list">${topProductsMarkup}</div>
  `;
}

function renderSalesReport(report) {
  latestAdminOverview = report || null;
  if (salesSummaryEl) {
    salesSummaryEl.innerHTML = renderOverviewMetricCards(report);
  }
  if (salesListEl) {
    salesListEl.innerHTML = '';
  }
  if (detailDailySalesEl) detailDailySalesEl.textContent = '';
  if (detailDailyMetaEl) detailDailyMetaEl.textContent = '';
  if (detailMonthlySalesEl) detailMonthlySalesEl.textContent = '';
  if (detailMonthlyMetaEl) detailMonthlyMetaEl.textContent = '';
  if (salesDetailedGridEl) {
    salesDetailedGridEl.innerHTML = renderOverviewDetailSection(report);
  }
  if (topProductsListEl) {
    topProductsListEl.innerHTML = renderOverviewTopLists(report);
  }
  if (adminMixPanelEl) {
    adminMixPanelEl.innerHTML = renderOverviewMixSection(report);
  }
  renderAdminStats(report);
}

function renderInventoryReport(report) {
  latestInventoryReportData = report || null;
  const defaultUnits = ['pcs', 'kg', 'g', 'liter', 'ml', 'pack', 'bottle'];

  function formatQty(value) {
    return Number(value || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function formatInventoryMoney(value) {
    return `PHP ${Number(value || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  function getInventoryStatusBadge(ingredient) {
    const qtyOnHand = Number(ingredient?.qtyOnHand || 0);
    if (qtyOnHand <= 0) {
      return '<span class="inventory-status-badge no-stock">No Stock</span>';
    }
    if (ingredient?.lowStock) {
      return '<span class="inventory-status-badge low-stock">Low Stock</span>';
    }
    return '<span class="inventory-status-badge in-stock">In Stock</span>';
  }

  function renderInventoryInsightPanel(title, contentMarkup) {
    if (!inventoryAlertsWrapEl) return;
    inventoryAlertsWrapEl.style.display = '';
    inventoryAlertsWrapEl.innerHTML = `
      <div class="inventory-monitor-section inventory-insight-panel">
        <div class="inventory-insight-header">
          <div>
            <span class="inventory-insight-eyebrow">Inventory View</span>
            <h3>${escapeHtml(title)}</h3>
          </div>
          <button type="button" class="secondary small" data-inventory-view="ingredients">Back to Ingredients</button>
        </div>
        ${contentMarkup}
      </div>
    `;
  }

  function buildInventoryTableRows(list, highlightedColumn = '') {
    highlightedColumn = String(highlightedColumn || '').trim();
    const columnClass = (key) => highlightedColumn === key ? 'inventory-column-highlight' : '';

    return list.map((x) => {
      const usageRows = (x.usageByProduct || [])
        .slice(0, 3)
        .map((u) => `<li>${escapeHtml(u.productName)}: used ${formatQty(u.estimatedUsedQty || 0)} ${escapeHtml(x.unit || 'pcs')}</li>`)
        .join('');
      const assignedCount = Array.isArray(x.usageByProduct) ? x.usageByProduct.length : 0;
      const actionsHtml = canManageInventory()
        ? `
          <div class="inventory-actions">
            <button class="secondary small" type="button" data-inventory-history="${escapeHtml(x.id || '')}" data-ingredient-name="${escapeHtml(x.name || '')}" data-ingredient-unit="${escapeHtml(x.unit || '')}">History</button>
            <button class="secondary small" type="button" data-inventory-edit="${escapeHtml(x.id || '')}" data-ingredient-name="${escapeHtml(x.name || '')}" data-ingredient-qty="${escapeHtml(String(x.qtyOnHand ?? ''))}" data-ingredient-unit-price="${escapeHtml(String(x.unitPrice ?? ''))}" data-ingredient-unit="${escapeHtml(x.unit || '')}" data-assigned-count="${assignedCount}">Edit</button>
            <button class="secondary small" type="button" data-inventory-delete="${escapeHtml(x.id || '')}" data-ingredient-name="${escapeHtml(x.name || '')}" data-assigned-count="${assignedCount}" ${assignedCount ? 'disabled' : ''}>Delete</button>
          </div>
          ${assignedCount ? `<small class="inventory-assigned-note">Assigned to ${assignedCount} product(s). Remove from kit spec before delete.</small>` : ''}
        `
        : 'View only';

      return `
        <tr>
          <td class="${columnClass('ingredient')}"><strong>${escapeHtml(x.name)}</strong></td>
          <td class="${columnClass('uom')}">${escapeHtml(x.unit || 'pcs')}</td>
          <td class="${columnClass('qty-on-hand')}">${formatQty(x.qtyOnHand || 0)}</td>
          <td class="${columnClass('unit-price')}">${formatInventoryMoney(x.unitPrice || 0)}</td>
          <td class="${columnClass('inventory-value')}">${formatInventoryMoney(x.inventoryValue || 0)}</td>
          <td class="${columnClass('estimated-used')}">${formatQty(x.estimatedUsedQty || 0)}</td>
          <td class="${columnClass('current-remaining')}">${formatQty(x.estimatedRemainingQty || 0)}</td>
          <td class="${columnClass('status')}">${getInventoryStatusBadge(x)}</td>
          <td class="${columnClass('used-in-products')}">${usageRows ? `<ul class="usage-list">${usageRows}</ul>` : 'No recipe mapping yet'}</td>
          <td class="${columnClass('actions')}">${actionsHtml}</td>
        </tr>
      `;
    }).join('');
  }

  function renderInventoryTableView(list, options = {}) {
    if (!inventoryTableWrapEl) return;
    const title = String(options.title || '').trim();
    const subtitle = String(options.subtitle || '').trim();
    const emptyMessage = String(options.emptyMessage || 'No ingredients available.').trim();
    const highlightedColumn = String(options.highlightedColumn || '').trim();
    const headingClass = (key) => highlightedColumn === key ? 'inventory-column-highlight' : '';

    inventoryTableWrapEl.style.display = '';
    if (!list.length) {
      inventoryTableWrapEl.innerHTML = `
        ${title ? `
          <div class="inventory-detail-heading">
            <h3>${escapeHtml(title)}</h3>
            ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ''}
          </div>
        ` : ''}
        <p>${escapeHtml(emptyMessage)}</p>
      `;
      return;
    }

    const rows = buildInventoryTableRows(list, highlightedColumn);
    inventoryTableWrapEl.innerHTML = `
      ${title ? `
        <div class="inventory-detail-heading">
          <h3>${escapeHtml(title)}</h3>
          ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ''}
        </div>
      ` : ''}
      <table class="inventory-table">
        <thead>
          <tr>
            <th class="${headingClass('ingredient')}">Ingredient</th>
            <th class="${headingClass('uom')}">UOM</th>
            <th class="${headingClass('qty-on-hand')}">Qty On Hand</th>
            <th class="${headingClass('unit-price')}">Unit Price</th>
            <th class="${headingClass('inventory-value')}">Inventory Value</th>
            <th class="${headingClass('estimated-used')}">Estimated Used</th>
            <th class="${headingClass('current-remaining')}">Current Remaining</th>
            <th class="${headingClass('status')}">Status</th>
            <th class="${headingClass('used-in-products')}">Used in Products</th>
            <th class="${headingClass('actions')}">Actions</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  }

  function renderInventoryBulkEditor(list) {
    if (!inventoryBulkEditorEl) return;
    if (!canManageInventory() || activeInventoryView !== 'ingredients') {
      inventoryBulkEditorOpen = false;
      syncInventoryBulkToggleButton();
      inventoryBulkEditorEl.style.display = 'none';
      inventoryBulkEditorEl.innerHTML = '';
      return;
    }

    if (!inventoryBulkEditorOpen) {
      syncInventoryBulkToggleButton();
      inventoryBulkEditorEl.style.display = 'none';
      inventoryBulkEditorEl.innerHTML = '';
      return;
    }

    syncInventoryBulkToggleButton();
    inventoryBulkEditorEl.style.display = '';
    if (!list.length) {
      inventoryBulkEditorEl.innerHTML = `
        <section class="inventory-bulk-editor-card">
          <div class="inventory-bulk-editor-head">
            <div>
              <span class="inventory-bulk-eyebrow">Bulk Edit</span>
              <h3>Bulk Stock and Price Update</h3>
            </div>
          </div>
          <p class="inventory-bulk-empty">Add ingredients first before using bulk edit.</p>
        </section>
      `;
      return;
    }

    inventoryBulkEditorEl.innerHTML = `
      <section class="inventory-bulk-editor-card">
        <div class="inventory-bulk-editor-head">
          <div>
            <span class="inventory-bulk-eyebrow">Bulk Edit</span>
            <h3>Bulk Stock and Price Update</h3>
            <p>Enter only the qty or unit price you want to change. Leave a field blank to keep the current value.</p>
          </div>
        </div>
        <form id="inventoryBulkEditForm" class="inventory-bulk-form">
          <div class="inventory-bulk-toolbar">
            <label for="inventoryBulkQtyMode">Qty Mode</label>
            <select id="inventoryBulkQtyMode">
              <option value="replace">Set qty on hand</option>
              <option value="add">Add to current qty</option>
            </select>
            <button id="inventoryBulkApplyBtn" type="submit">Apply Bulk Update</button>
            <button id="inventoryBulkResetBtn" class="secondary" type="button">Clear Inputs</button>
          </div>
          <p id="inventoryBulkStatus" class="status">Blank fields remain unchanged.</p>
          <div class="inventory-bulk-table-wrap">
            <table class="inventory-table inventory-bulk-table">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>UOM</th>
                  <th>Current Qty</th>
                  <th>New Qty</th>
                  <th class="inventory-bulk-price-col">Current Unit Price</th>
                  <th class="inventory-bulk-price-col">New Price</th>
                </tr>
              </thead>
              <tbody>
                ${list.map((item) => `
                  <tr
                    data-bulk-ingredient-id="${escapeHtml(item.id || '')}"
                    data-bulk-name="${escapeHtml(item.name || '')}"
                    data-bulk-unit="${escapeHtml(item.unit || 'pcs')}"
                    data-bulk-qty="${escapeHtml(String(Number(item.qtyOnHand || 0)))}"
                    data-bulk-price="${escapeHtml(String(Number(item.unitPrice || 0)))}"
                  >
                    <td><strong>${escapeHtml(item.name || 'Ingredient')}</strong></td>
                    <td>${escapeHtml(item.unit || 'pcs')}</td>
                    <td>${formatQty(item.qtyOnHand || 0)}</td>
                    <td><input class="inventory-bulk-qty-input" type="number" min="0" step="0.001" placeholder="Unchanged" /></td>
                    <td class="inventory-bulk-price-col inventory-bulk-price-value">${formatInventoryMoney(item.unitPrice || 0)}</td>
                    <td class="inventory-bulk-price-col"><input class="inventory-bulk-price-input" type="number" min="0" step="0.01" placeholder="Unchanged" /></td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </form>
      </section>
    `;
  }

  function renderInventoryCardView(monitor, ingredients) {
    const topConsumedToday = Array.isArray(monitor?.topConsumedToday) ? monitor.topConsumedToday : [];
    const alerts = Array.isArray(monitor?.alerts) ? monitor.alerts : [];
    const normalizedView = [
      'ingredients',
      'inventory-value',
      'unit-price',
      'low-stock',
      'consumed',
      'alerts'
    ].includes(activeInventoryView)
      ? activeInventoryView
      : 'ingredients';

    activeInventoryView = normalizedView;

    const showIngredientManagement = normalizedView === 'ingredients';
    if (inventoryIngredientFormEl) {
      inventoryIngredientFormEl.style.display = showIngredientManagement && canManageInventory() ? 'flex' : 'none';
    }
    if (inventoryAdminNoteEl) {
      inventoryAdminNoteEl.style.display = showIngredientManagement && !canManageInventory() ? 'block' : 'none';
    }
    if (!showIngredientManagement || !canManageInventory()) {
      inventoryBulkEditorOpen = false;
    }
    syncInventoryBulkToggleButton();
    renderInventoryBulkEditor(showIngredientManagement ? ingredients : []);
    if (inventoryAlertsWrapEl) {
      inventoryAlertsWrapEl.style.display = 'none';
      inventoryAlertsWrapEl.innerHTML = '';
    }
    if (inventoryTableWrapEl) {
      inventoryTableWrapEl.style.display = '';
      inventoryTableWrapEl.innerHTML = '';
    }

    if (showIngredientManagement && canManageInventory() && inventoryBulkEditorOpen) {
      if (inventoryTableWrapEl) {
        inventoryTableWrapEl.style.display = 'none';
        inventoryTableWrapEl.innerHTML = '';
      }
      return;
    }

    if (normalizedView === 'consumed') {
      if (inventoryTableWrapEl) inventoryTableWrapEl.style.display = 'none';
      renderInventoryInsightPanel(
        'Top Ingredients Consumed Today',
        topConsumedToday.length
          ? `
            <table class="inventory-table inventory-monitor-table">
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Qty Deducted</th>
                  <th>Current Stock</th>
                  <th>Sales Trigger</th>
                </tr>
              </thead>
              <tbody>
                ${topConsumedToday.map((row) => `
                  <tr>
                    <td><strong>${escapeHtml(row.ingredientName || 'Ingredient')}</strong></td>
                    <td>${formatQty(row.qtyDeducted || 0)} ${escapeHtml(row.ingredientUnit || 'pcs')}</td>
                    <td>${formatQty(row.currentQtyOnHand || 0)} ${escapeHtml(row.ingredientUnit || 'pcs')}</td>
                    <td>${escapeHtml(row.productSummary || 'Sales deduction')}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `
          : '<p>No sale-based ingredient deductions yet today.</p>'
      );
      return;
    }

    if (normalizedView === 'alerts') {
      if (inventoryTableWrapEl) inventoryTableWrapEl.style.display = 'none';
      renderInventoryInsightPanel(
        'Fast Alerts',
        alerts.length
          ? `
            <div class="inventory-alert-list">
              ${alerts.map((row) => `
                <article class="inventory-alert-item ${escapeHtml(row.severity || 'warning')}">
                  <div>
                    <strong>${escapeHtml(row.ingredientName || 'Ingredient')}</strong>
                    <span>${formatQty(row.qtyOnHand || 0)} ${escapeHtml(row.ingredientUnit || 'pcs')} remaining</span>
                  </div>
                  <small>${escapeHtml(row.affectedProducts ? `Used by: ${row.affectedProducts}` : 'No product mapping yet')}</small>
                </article>
              `).join('')}
            </div>
          `
          : '<p>All monitored ingredients currently have healthy stock levels.</p>'
      );
      return;
    }

    if (normalizedView === 'inventory-value') {
      renderInventoryTableView(
        ingredients.slice().sort((a, b) => Number(b.inventoryValue || 0) - Number(a.inventoryValue || 0)),
        {
          title: 'Inventory Value',
          subtitle: 'Ingredients sorted by highest current inventory value.',
          emptyMessage: 'No ingredients available for inventory value view.',
          highlightedColumn: 'inventory-value'
        }
      );
      return;
    }

    if (normalizedView === 'unit-price') {
      renderInventoryTableView(
        ingredients.slice().sort((a, b) => Number(b.unitPrice || 0) - Number(a.unitPrice || 0)),
        {
          title: 'Unit Price Sum',
          subtitle: 'Ingredients sorted by highest unit price.',
          emptyMessage: 'No ingredients available for unit price view.',
          highlightedColumn: 'unit-price'
        }
      );
      return;
    }

    if (normalizedView === 'low-stock') {
      renderInventoryTableView(
        ingredients.filter((item) => Number(item?.qtyOnHand || 0) <= 0 || item?.lowStock),
        {
          title: 'Low Stock Items',
          subtitle: 'Ingredients that need restocking first.',
          emptyMessage: 'No low stock ingredients found.',
          highlightedColumn: 'status'
        }
      );
      return;
    }

    renderInventoryTableView(ingredients, {
      emptyMessage: 'No ingredients yet. Add your first ingredient above.',
      highlightedColumn: 'ingredient'
    });
  }

  const totals = report?.totals || {};
  const ingredients = Array.isArray(report?.ingredients) ? report.ingredients : [];
  const monitor = report?.monitor || {};
  const topConsumedCount = Array.isArray(monitor?.topConsumedToday) ? monitor.topConsumedToday.length : 0;
  const alertCount = Array.isArray(monitor?.alerts) ? monitor.alerts.length : 0;
  if (ingredientUnitSuggestionsEl) {
    const unitOptions = Array.from(new Set(
      defaultUnits
        .concat(ingredients.map((item) => String(item?.unit || '').trim()))
        .filter(Boolean)
        .map((unit) => unit.toLowerCase())
    )).sort((a, b) => a.localeCompare(b));
    ingredientUnitSuggestionsEl.innerHTML = unitOptions
      .map((unit) => `<option value="${escapeHtml(unit)}"></option>`)
      .join('');
  }

  if (inventorySummaryEl) {
    const summaryGroups = [
      {
        title: 'Inventory Summary',
        cards: [
          {
            label: 'Ingredients',
            value: Number(totals.totalIngredients || 0).toLocaleString('en-US'),
            accent: 'ingredients',
            view: 'ingredients',
            icon: '📦',
            meta: 'Total items tracked',
            hoverInfo: 'Opens the full inventory list with the ingredient form, stock table, and actions.'
          },
          {
            label: 'Inventory Value',
            value: formatInventoryMoney(totals.totalInventoryValue || 0),
            accent: 'inventory-value',
            view: 'inventory-value',
            icon: '💰',
            meta: 'Current stock worth',
            hoverInfo: 'Shows ingredients sorted by highest inventory value so you can see where most stock value sits.'
          },
          {
            label: 'Unit Price Sum',
            value: formatInventoryMoney(totals.totalUnitPriceValue || 0),
            accent: 'unit-price',
            view: 'unit-price',
            icon: '🏷',
            meta: 'Combined unit pricing',
            hoverInfo: 'Shows ingredients sorted by unit price to highlight the most expensive items first.'
          }
        ]
      },
      {
        title: 'Status & Warnings',
        cards: [
          {
            label: 'Low Stock',
            value: Number(totals.lowStockCount || 0).toLocaleString('en-US'),
            accent: 'low-stock',
            view: 'low-stock',
            icon: '⚠',
            meta: 'Items need restock',
            hoverInfo: 'Filters the inventory table to low-stock and no-stock ingredients that need replenishment.'
          },
          {
            label: 'Consumed',
            value: Number(topConsumedCount || 0).toLocaleString('en-US'),
            accent: 'top-consumed',
            view: 'consumed',
            icon: '🍳',
            meta: topConsumedCount ? 'Used in recent sales' : 'No recent usage',
            hoverInfo: 'Opens the consumption panel with ingredients recently deducted by product sales.'
          },
          {
            label: 'Alerts',
            value: Number(alertCount || 0).toLocaleString('en-US'),
            accent: 'fast-alerts',
            view: 'alerts',
            icon: '🚨',
            meta: alertCount ? 'Issues need review' : 'No active issues',
            hoverInfo: 'Opens the alert panel so you can review inventory issues and affected products quickly.'
          }
        ]
      }
    ];

    inventorySummaryEl.innerHTML = `
      <div class="inventory-summary-shell">
        <div class="inventory-summary-header">
          <span class="inventory-summary-eyebrow">Inventory Snapshot</span>
          <h3>Ingredient Stock Overview</h3>
        </div>
        <div class="inventory-summary-groups">
          ${summaryGroups.map((group) => `
            <section class="inventory-summary-group">
              <div class="inventory-summary-group-title">${escapeHtml(group.title)}</div>
              <div class="inventory-summary-grid">
                ${group.cards.map((card) => `
                  <article
                    class="inventory-summary-card ${escapeHtml(card.accent)}${card.view === activeInventoryView ? ' active' : ''} clickable"
                    data-inventory-view="${escapeHtml(card.view)}"
                    role="button"
                    tabindex="0"
                    title="${escapeHtml(card.hoverInfo || '')}"
                  >
                    <div class="inventory-summary-card-head">
                      <span class="inventory-summary-icon" aria-hidden="true">${card.icon}</span>
                      <span class="inventory-summary-label">${escapeHtml(card.label)}</span>
                    </div>
                    <strong>${escapeHtml(card.value)}</strong>
                    <small>${escapeHtml(card.meta)}</small>
                    <span class="inventory-summary-hover-note">${escapeHtml(card.hoverInfo || '')}</span>
                    <span class="inventory-summary-link">${card.view === activeInventoryView ? 'Showing below' : 'View details ->'}</span>
                  </article>
                `).join('')}
              </div>
            </section>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderInventoryCardView(monitor, ingredients);
}

async function refreshInventoryModule() {
  if (!canAccessInventoryPanel()) return;
  const isAdmin = canManageInventory();
  const showIngredientManagement = activeInventoryView === 'ingredients';
  if (inventoryIngredientFormEl) {
    inventoryIngredientFormEl.style.display = isAdmin && showIngredientManagement ? 'flex' : 'none';
  }
  if (inventoryAdminNoteEl) {
    inventoryAdminNoteEl.style.display = !isAdmin && showIngredientManagement ? 'block' : 'none';
  }
  if (!isAdmin || !showIngredientManagement) {
    inventoryBulkEditorOpen = false;
  }
  syncInventoryBulkToggleButton();
  if (inventoryBulkEditorEl) {
    inventoryBulkEditorEl.style.display = showIngredientManagement && isAdmin && inventoryBulkEditorOpen ? '' : 'none';
    inventoryBulkEditorEl.innerHTML = showIngredientManagement && isAdmin && inventoryBulkEditorOpen
      ? '<p>Loading bulk editor...</p>'
      : '';
  }

  if (inventorySummaryEl) inventorySummaryEl.innerHTML = '<div class="inventory-summary-loading">Loading inventory summary...</div>';
  if (inventoryAlertsWrapEl) {
    inventoryAlertsWrapEl.style.display = 'none';
    inventoryAlertsWrapEl.innerHTML = '';
  }
  if (inventoryTableWrapEl) inventoryTableWrapEl.innerHTML = '<p>Loading ingredients...</p>';

  try {
    const report = await api('/api/admin/inventory/report', {
      headers: buildActorHeaders()
    });
    renderInventoryReport(report);
  } catch (error) {
    if (inventorySummaryEl) inventorySummaryEl.innerHTML = `<p class="error">Inventory error: ${escapeHtml(error.message)}</p>`;
    if (inventoryBulkEditorEl) {
      inventoryBulkEditorEl.style.display = 'none';
      inventoryBulkEditorEl.innerHTML = '';
    }
    if (inventoryAlertsWrapEl) {
      inventoryAlertsWrapEl.style.display = 'none';
      inventoryAlertsWrapEl.innerHTML = '';
    }
    if (inventoryTableWrapEl) inventoryTableWrapEl.innerHTML = '';
  }
}

function getKitSpecProductsForCategory(categoryKey = '') {
  const safeCategoryKey = String(categoryKey || '').trim().toLowerCase();
  let products = Array.isArray(state.products) ? state.products.slice() : [];
  if (safeCategoryKey) {
    products = products.filter((product) => String(product.category || '').trim().toLowerCase() === safeCategoryKey);
  }
  return products.sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));
}

function populateKitSpecCategoryOptions(selectedCategory = '') {
  if (!kitSpecCategorySelectEl) return;
  const categories = Array.isArray(state.categories) ? state.categories : [];
  kitSpecCategorySelectEl.innerHTML = categories
    .map((category) => `<option value="${escapeHtml(category.key || '')}">${escapeHtml(category.name || category.key || 'Category')}</option>`)
    .join('');
  if (selectedCategory && categories.some((category) => String(category.key || '') === selectedCategory)) {
    kitSpecCategorySelectEl.value = selectedCategory;
  } else if (categories[0]?.key) {
    kitSpecCategorySelectEl.value = categories[0].key;
  }
}

function loadKitSpecDraftRowsForSelectedProduct() {
  const productId = String(kitSpecProductSelectEl?.value || '').trim();
  kitSpecDraftRows = kitSpecRecipes
    .filter((recipe) => String(recipe.productId || '') === productId)
    .map((recipe) => ({
      ingredientId: String(recipe.ingredientId || '').trim(),
      qtyPerProduct: Number(recipe.qtyPerProduct || 0)
    }));
  if (!kitSpecDraftRows.length) {
    kitSpecDraftRows = [{ ingredientId: '', qtyPerProduct: '' }];
  }
}

function renderKitSpecProductOptions(selectedProductId = '') {
  if (!kitSpecProductSelectEl) return;
  const categoryKey = String(kitSpecCategorySelectEl?.value || '').trim().toLowerCase();
  const products = getKitSpecProductsForCategory(categoryKey);
  kitSpecProductSelectEl.innerHTML = products.length
    ? products.map((product) => `<option value="${escapeHtml(product.id || '')}">${escapeHtml(product.name || 'Product')}</option>`).join('')
    : '<option value="">No products in this category</option>';

  if (selectedProductId && products.some((product) => String(product.id || '') === selectedProductId)) {
    kitSpecProductSelectEl.value = selectedProductId;
  } else if (products[0]?.id) {
    kitSpecProductSelectEl.value = products[0].id;
  }
  loadKitSpecDraftRowsForSelectedProduct();
}

function formatKitSpecQtyValue(value) {
  return Number(Number(value || 0).toFixed(3)).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  });
}

function getKitSpecIngredientById(ingredientId) {
  const safeIngredientId = String(ingredientId || '').trim();
  if (!safeIngredientId) return null;
  return (kitSpecIngredients || []).find((ingredient) => String(ingredient?.id || '').trim() === safeIngredientId) || null;
}

function getKitSpecIngredientLabel(ingredient) {
  const name = String(ingredient?.name || 'Ingredient').trim() || 'Ingredient';
  const unit = String(ingredient?.unit || 'pcs').trim() || 'pcs';
  const qtyOnHand = formatKitSpecQtyValue(ingredient?.qtyOnHand || 0);
  return `${name} (${unit} • On hand: ${qtyOnHand})`;
}

function buildKitSpecIngredientOptionsForRow(rowIndex) {
  const currentIngredientId = String(kitSpecDraftRows[rowIndex]?.ingredientId || '').trim();
  const selectedInOtherRows = new Set(
    kitSpecDraftRows
      .map((row, index) => (index === rowIndex ? '' : String(row?.ingredientId || '').trim()))
      .filter(Boolean)
  );

  return ['<option value="">Select ingredient</option>']
    .concat(kitSpecIngredients
      .filter((ingredient) => {
        const ingredientId = String(ingredient?.id || '').trim();
        return ingredientId && (!selectedInOtherRows.has(ingredientId) || ingredientId === currentIngredientId);
      })
      .map((ingredient) => `
        <option value="${escapeHtml(ingredient.id || '')}">${escapeHtml(getKitSpecIngredientLabel(ingredient))}</option>
      `))
    .join('');
}

function renderKitSpecEditor() {
  if (!kitSpecEditorEl) return;
  if (state.appConfig?.enforceKitSpec === false) {
    kitSpecEditorEl.style.display = 'none';
    kitSpecEditorEl.innerHTML = '';
    return;
  }
  kitSpecEditorEl.style.display = '';
  const selectedProductId = String(kitSpecProductSelectEl?.value || '').trim();
  if (!selectedProductId) {
    kitSpecEditorEl.innerHTML = '<p>Select a category and product to configure its kit specification.</p>';
    return;
  }
  if (!kitSpecIngredients.length) {
    kitSpecEditorEl.innerHTML = '<p>Add inventory ingredients first before assigning them to products.</p>';
    return;
  }

  const rows = (Array.isArray(kitSpecDraftRows) && kitSpecDraftRows.length ? kitSpecDraftRows : [{ ingredientId: '', qtyPerProduct: '' }])
    .map((row, index) => {
      const selectedIngredient = getKitSpecIngredientById(row?.ingredientId);
      const availableQty = selectedIngredient ? Number(selectedIngredient.qtyOnHand || 0) : null;
      const unit = String(selectedIngredient?.unit || 'pcs').trim() || 'pcs';
      const availableLabel = availableQty === null
        ? 'Select an ingredient to set the qty limit.'
        : availableQty > 0
          ? `Available now: ${formatKitSpecQtyValue(availableQty)} ${unit}. Max per product: ${formatKitSpecQtyValue(availableQty)}.`
          : `Warning: ${selectedIngredient?.name || 'This ingredient'} has no stock on hand right now.`;
      const hintClass = availableQty !== null && availableQty <= 1 ? ' warning' : '';
      const maxAttr = availableQty !== null && availableQty > 0 ? ` max="${escapeHtml(String(Number(availableQty.toFixed(3))))}"` : '';

      return `
        <div class="kit-spec-editor-row" data-kit-spec-row="${index}">
          <select data-kit-spec-field="ingredientId">
            ${buildKitSpecIngredientOptionsForRow(index)}
          </select>
          <div class="kit-spec-qty-field">
            <input data-kit-spec-field="qtyPerProduct" type="number" min="0" step="0.001" placeholder="Qty per product" value="${escapeHtml(row.qtyPerProduct === '' ? '' : String(row.qtyPerProduct || ''))}"${maxAttr} />
            <small class="kit-spec-qty-hint${hintClass}">${escapeHtml(availableLabel)}</small>
          </div>
          <button class="secondary small" type="button" data-kit-spec-remove="${index}">Remove</button>
        </div>
      `;
    })
    .join('');

  kitSpecEditorEl.innerHTML = rows;
  kitSpecEditorEl.querySelectorAll('[data-kit-spec-row]').forEach((rowEl, index) => {
    const ingredientSelect = rowEl.querySelector('[data-kit-spec-field="ingredientId"]');
    if (ingredientSelect) ingredientSelect.value = String(kitSpecDraftRows[index]?.ingredientId || '');
  });
}

function getSortedKitSpecCoverageProducts(products = []) {
  return products.slice().sort((a, b) => {
    const byCategory = String(a.category || '').localeCompare(String(b.category || ''));
    if (byCategory !== 0) return byCategory;
    return String(a.name || '').localeCompare(String(b.name || ''));
  });
}

function getKitSpecCoverageSnapshot() {
  const products = getSortedKitSpecCoverageProducts(Array.isArray(state.products) ? state.products : []);
  const ingredients = Array.isArray(kitSpecIngredients) ? kitSpecIngredients.slice() : [];
  const categoryNameByKey = new Map((state.categories || []).map((category) => [String(category.key || ''), category.name || category.key]));
  const recipeByProductId = new Map();
  const productIdsByIngredientId = new Map();

  kitSpecRecipes.forEach((recipe) => {
    const productId = String(recipe.productId || '').trim();
    const ingredientId = String(recipe.ingredientId || '').trim();
    if (!recipeByProductId.has(productId)) recipeByProductId.set(productId, []);
    recipeByProductId.get(productId).push(recipe);
    if (ingredientId) {
      if (!productIdsByIngredientId.has(ingredientId)) productIdsByIngredientId.set(ingredientId, new Set());
      if (productId) productIdsByIngredientId.get(ingredientId).add(productId);
    }
  });

  const configuredProducts = [];
  const missingProducts = [];
  products.forEach((product) => {
    const recipes = recipeByProductId.get(String(product.id || '').trim()) || [];
    if (recipes.length) {
      configuredProducts.push(product);
    } else {
      missingProducts.push(product);
    }
  });

  const unassignedIngredients = ingredients
    .filter((ingredient) => !productIdsByIngredientId.get(String(ingredient.id || '').trim())?.size)
    .sort((a, b) => String(a.name || '').localeCompare(String(b.name || '')));

  return {
    products,
    ingredients,
    categoryNameByKey,
    recipeByProductId,
    configuredProducts,
    missingProducts,
    unassignedIngredients
  };
}

function renderKitSpecCoverageSummary(snapshot) {
  if (!kitSpecSummaryEl) return;
  const filters = [
    {
      key: 'all-products',
      label: 'All Products',
      count: snapshot.products.length,
      icon: '📋',
      meta: 'Every product in the menu',
      hoverInfo: 'Shows all products and whether each one already has a kit specification assigned.'
    },
    {
      key: 'configured-products',
      label: 'Configured',
      count: snapshot.configuredProducts.length,
      icon: '✅',
      meta: 'Products already mapped',
      hoverInfo: 'Shows only products that already have saved kit specs and ingredient mappings.'
    },
    {
      key: 'missing-products',
      label: 'Missing Specs',
      count: snapshot.missingProducts.length,
      icon: '🧩',
      meta: 'Products without kit spec',
      hoverInfo: 'Shows products that still need ingredients assigned before stock can deduct automatically.'
    },
    {
      key: 'unassigned-ingredients',
      label: 'Unused Ingredients',
      count: snapshot.unassignedIngredients.length,
      icon: '🧂',
      meta: 'Ingredients not linked yet',
      hoverInfo: 'Shows inventory ingredients that are not connected to any product kit specification yet.'
    }
  ];

  if (!filters.some((filter) => filter.key === kitSpecCoverageFilter)) {
    kitSpecCoverageFilter = 'all-products';
  }

  const activeFilter = filters.find((filter) => filter.key === kitSpecCoverageFilter) || filters[0];
  kitSpecSummaryEl.innerHTML = `
    <div class="kit-spec-summary-shell">
      <div class="kit-spec-summary-header">
        <span class="kit-spec-summary-eyebrow">Kit Overview</span>
        <h3>Configuration Coverage</h3>
      </div>
      <div class="kit-spec-summary-buttons" role="group" aria-label="Kit specification coverage filters">
      ${filters.map((filter) => `
        <button
          type="button"
          class="kit-spec-summary-btn${filter.key === activeFilter.key ? ' active' : ''}"
          data-kit-spec-filter="${escapeHtml(filter.key)}"
          title="${escapeHtml(filter.hoverInfo || '')}"
        >
          <span class="kit-spec-summary-btn-head">
            <span class="kit-spec-summary-icon" aria-hidden="true">${filter.icon}</span>
            <span class="kit-spec-summary-label">${escapeHtml(filter.label)}</span>
          </span>
          <strong>${Number(filter.count || 0).toLocaleString('en-US')}</strong>
          <small>${escapeHtml(filter.meta)}</small>
          <span class="kit-spec-summary-hover-note">${escapeHtml(filter.hoverInfo || '')}</span>
          <span class="kit-spec-summary-link">${filter.key === activeFilter.key ? 'Showing below' : 'View details ->'}</span>
        </button>
      `).join('')}
      </div>
      <div class="kit-spec-summary-caption">Showing ${escapeHtml(activeFilter.label.toLowerCase())}.</div>
    </div>
  `;
}

function renderKitSpecCoverageProductTable(products, snapshot, emptyLabel, options = {}) {
  if (!products.length) {
    kitSpecModuleEl.innerHTML = `<p class="kit-spec-empty-state">${escapeHtml(emptyLabel)}</p>`;
    return;
  }

  const showStatusOnly = options.showStatusOnly === true;
  const rows = products
    .map((product) => {
      const recipes = snapshot.recipeByProductId.get(String(product.id || '').trim()) || [];
      const recipeSummary = showStatusOnly
        ? (recipes.length
          ? '<span class="kit-spec-status-badge configured">Have already kit spec</span>'
          : '<span class="kit-spec-status-badge missing">No ingredients assigned</span>')
        : (recipes.length
          ? escapeHtml(recipes.map((recipe) => `${recipe.ingredientName} (${Number(recipe.qtyPerProduct || 0).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 })} ${recipe.ingredientUnit || 'pcs'})`).join(', '))
          : 'No ingredients assigned');
      return `
        <tr>
          <td>${escapeHtml(snapshot.categoryNameByKey.get(String(product.category || '')) || product.category || 'Category')}</td>
          <td><strong>${escapeHtml(product.name || 'Product')}</strong></td>
          <td>${recipeSummary}</td>
        </tr>
      `;
    })
    .join('');

  kitSpecModuleEl.innerHTML = `
    <table class="admin-inline-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Product</th>
          <th>Ingredients Used</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderKitSpecCoverageIngredientTable(ingredients) {
  if (!ingredients.length) {
    kitSpecModuleEl.innerHTML = '<p class="kit-spec-empty-state">All available ingredients are already assigned to at least one kit spec.</p>';
    return;
  }

  const rows = ingredients
    .map((ingredient) => `
      <tr>
        <td><strong>${escapeHtml(ingredient.name || 'Ingredient')}</strong></td>
        <td>${escapeHtml(ingredient.unit || 'pcs')}</td>
        <td>Not assigned to any product</td>
      </tr>
    `)
    .join('');

  kitSpecModuleEl.innerHTML = `
    <table class="admin-inline-table">
      <thead>
        <tr>
          <th>Ingredient</th>
          <th>Unit</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderKitSpecCoverage() {
  if (!kitSpecModuleEl) return;
  const snapshot = getKitSpecCoverageSnapshot();
  if (!snapshot.products.length) {
    kitSpecModuleEl.innerHTML = '<p class="kit-spec-empty-state">No products available yet.</p>';
    if (kitSpecSummaryEl) kitSpecSummaryEl.innerHTML = '<div class="kit-spec-summary-loading">No products available yet.</div>';
    return;
  }

  renderKitSpecCoverageSummary(snapshot);

  if (kitSpecCoverageFilter === 'configured-products') {
    renderKitSpecCoverageProductTable(snapshot.configuredProducts, snapshot, 'No products have a saved kit specification yet.');
    return;
  }
  if (kitSpecCoverageFilter === 'missing-products') {
    renderKitSpecCoverageProductTable(snapshot.missingProducts, snapshot, 'All products already have a configured kit specification.');
    return;
  }
  if (kitSpecCoverageFilter === 'unassigned-ingredients') {
    renderKitSpecCoverageIngredientTable(snapshot.unassignedIngredients);
    return;
  }

  renderKitSpecCoverageProductTable(snapshot.products, snapshot, 'No products available yet.', { showStatusOnly: true });
}

function renderKitSpecModeControl() {
  if (!kitSpecModeControlEl || !kitSpecModeLabelEl || !kitSpecModeHintEl || !kitSpecModeToggleBtnEl) return;

  const enforceKitSpec = state.appConfig?.enforceKitSpec !== false;
  const canToggle = normalizeRoleChoice(activeAuthSession?.role) === 'administrations';

  kitSpecModeLabelEl.textContent = enforceKitSpec ? 'Kit Spec Required' : 'Open Ordering Mode';
  kitSpecModeHintEl.textContent = enforceKitSpec
    ? 'Products need a valid kit spec and enough ingredient stock before they can be ordered. Paid sales deduct ingredient inventory.'
    : 'Products can be ordered and paid without kit specs or ingredient stock checks. Sales are still recorded, but ingredient deduction is disabled.';
  kitSpecModeControlEl.classList.toggle('disabled', !enforceKitSpec);
  kitSpecModeToggleBtnEl.style.display = canToggle ? '' : 'none';
  kitSpecModeToggleBtnEl.textContent = enforceKitSpec ? 'Turn Off Requirement' : 'Turn On Requirement';
}

function syncKitSpecBuilderVisibility() {
  const enforceKitSpec = state.appConfig?.enforceKitSpec !== false;
  if (kitSpecControlBarEl) {
    kitSpecControlBarEl.style.display = enforceKitSpec ? 'grid' : 'none';
  }
  if (kitSpecEditorEl) {
    kitSpecEditorEl.style.display = enforceKitSpec ? '' : 'none';
    if (!enforceKitSpec) {
      kitSpecEditorEl.innerHTML = '';
    }
  }
}

async function refreshKitSpecModule() {
  if (!kitSpecModuleEl || !canAccessKitSpecPanel()) return;
  renderKitSpecModeControl();
  syncKitSpecBuilderVisibility();
  if (kitSpecNoteEl) {
    if (state.appConfig?.enforceKitSpec === false) {
      kitSpecNoteEl.textContent = canManageInventory()
        ? 'Kit spec requirement is currently turned off. The Kit Builder inputs are hidden because ordering and payment no longer depend on recipes or ingredient stock.'
        : 'Kit spec requirement is currently turned off. The Kit Builder inputs are hidden because products can be sold without ingredient checks.';
    } else {
      kitSpecNoteEl.textContent = canAccessKitSpecPanel()
        ? 'Assign the exact ingredients and quantity used by each product. Paid orders will deduct stock from these kit specs.'
        : 'View-only mode. Current role cannot manage kit specification.';
    }
  }
  if (kitSpecModuleEl) kitSpecModuleEl.innerHTML = '<p class="kit-spec-empty-state">Loading kit specification records...</p>';
  if (kitSpecEditorEl) kitSpecEditorEl.innerHTML = '<p class="kit-spec-empty-state">Loading product ingredients...</p>';
  if (kitSpecSummaryEl) kitSpecSummaryEl.innerHTML = '<div class="kit-spec-summary-loading">Loading product kit coverage...</div>';

  try {
    const currentCategory = String(kitSpecCategorySelectEl?.value || '').trim().toLowerCase();
    const currentProductId = String(kitSpecProductSelectEl?.value || '').trim();
    const result = await api('/api/admin/kit-spec', {
      headers: buildActorHeaders()
    });

    state.categories = Array.isArray(result?.categories) ? result.categories.map((x) => ({
      key: String(x.key || '').trim().toLowerCase(),
      name: String(x.name || '').trim() || String(x.key || ''),
      image: String(x.image || '').trim() || getDefaultCategoryImage(x.key),
      sortOrder: Number(x.sortOrder || 0)
    })) : state.categories;
    state.products = Array.isArray(result?.products) ? result.products.map((x) => ({
      ...toClientProduct(x)
    })) : state.products;
    applyAppConfig(result?.appConfig || state.appConfig);
    kitSpecIngredients = Array.isArray(result?.ingredients) ? result.ingredients : [];
    kitSpecRecipes = Array.isArray(result?.recipes) ? result.recipes : [];

    populateKitSpecCategoryOptions(currentCategory);
    renderKitSpecProductOptions(currentProductId);
    renderKitSpecEditor();
    renderKitSpecCoverage();
  } catch (error) {
    if (kitSpecModuleEl) kitSpecModuleEl.innerHTML = `<p class="error">Kit specification error: ${escapeHtml(error.message)}</p>`;
    if (kitSpecEditorEl) kitSpecEditorEl.innerHTML = '';
    if (kitSpecSummaryEl) kitSpecSummaryEl.innerHTML = '';
  }
}

async function handleKitSpecModeToggle() {
  if (normalizeRoleChoice(activeAuthSession?.role) !== 'administrations') {
    setStatus('Only Administrations can change the Kit Spec requirement.');
    return;
  }

  const nextEnforceKitSpec = !(state.appConfig?.enforceKitSpec !== false);
  try {
    if (kitSpecModeToggleBtnEl) {
      kitSpecModeToggleBtnEl.disabled = true;
      kitSpecModeToggleBtnEl.textContent = 'Saving...';
    }

    const result = await api('/api/admin/app-config', {
      method: 'PUT',
      headers: buildActorHeaders(),
      body: JSON.stringify({
        enforceKitSpec: nextEnforceKitSpec
      })
    });

    applyAppConfig(result?.appConfig || state.appConfig);
    syncKitSpecBuilderVisibility();
    await Promise.all([
      refreshCatalog({ keepCategory: true }),
      refreshKitSpecModule(),
      canAccessAdminFeatures() ? refreshInventoryModule() : Promise.resolve()
    ]);
    setStatus(nextEnforceKitSpec
      ? 'Kit Spec requirement turned on. Ordering now depends on kit specs and ingredient stock again.'
      : 'Kit Spec requirement turned off. Products can now be ordered without kit specs, and ingredient deduction is disabled.');
  } catch (error) {
    setStatus(`Kit Spec mode update failed: ${error.message}`);
  } finally {
    if (kitSpecModeToggleBtnEl) {
      kitSpecModeToggleBtnEl.disabled = false;
      renderKitSpecModeControl();
    }
  }
}

function updateKitSpecDraftFromEditor() {
  if (!kitSpecEditorEl) return;
  kitSpecDraftRows = Array.from(kitSpecEditorEl.querySelectorAll('[data-kit-spec-row]')).map((rowEl) => ({
    ingredientId: String(rowEl.querySelector('[data-kit-spec-field="ingredientId"]')?.value || '').trim(),
    qtyPerProduct: String(rowEl.querySelector('[data-kit-spec-field="qtyPerProduct"]')?.value || '').trim()
  }));
}

function addKitSpecDraftRow() {
  updateKitSpecDraftFromEditor();
  kitSpecDraftRows.push({ ingredientId: '', qtyPerProduct: '' });
  renderKitSpecEditor();
}

function enforceKitSpecDraftQtyLimit(rowIndex, { showStatus = false } = {}) {
  const row = kitSpecDraftRows[rowIndex];
  if (!row) return false;

  const ingredient = getKitSpecIngredientById(row.ingredientId);
  if (!ingredient) return false;

  const ingredientName = String(ingredient.name || 'Ingredient').trim() || 'Ingredient';
  const ingredientUnit = String(ingredient.unit || 'pcs').trim() || 'pcs';
  const availableQty = Number(ingredient.qtyOnHand || 0);
  const rawQty = String(row.qtyPerProduct || '').trim();
  if (!rawQty) return false;

  const qtyPerProduct = Number(rawQty);
  if (!Number.isFinite(qtyPerProduct) || qtyPerProduct <= 0) return false;

  if (availableQty <= 0) {
    row.qtyPerProduct = '';
    if (showStatus) {
      setStatus(`Warning: ${ingredientName} has no stock on hand. Restock it before setting qty per product.`);
    }
    return true;
  }

  if (qtyPerProduct > availableQty) {
    row.qtyPerProduct = String(Number(availableQty.toFixed(3)));
    if (showStatus) {
      setStatus(`Warning: Qty per product for "${ingredientName}" cannot exceed ${formatKitSpecQtyValue(availableQty)} ${ingredientUnit}.`);
    }
    return true;
  }

  return false;
}

function handleKitSpecEditorFieldChange(fieldEl) {
  if (!fieldEl || !kitSpecEditorEl) return;
  const rowEl = fieldEl.closest('[data-kit-spec-row]');
  const rowIndex = Number(rowEl?.getAttribute('data-kit-spec-row'));
  if (!Number.isInteger(rowIndex) || rowIndex < 0) return;

  updateKitSpecDraftFromEditor();
  if (!kitSpecDraftRows[rowIndex]) return;

  const fieldName = String(fieldEl.getAttribute('data-kit-spec-field') || '').trim();
  if (fieldName === 'ingredientId') {
    const ingredientId = String(kitSpecDraftRows[rowIndex].ingredientId || '').trim();
    if (ingredientId) {
      const duplicateIndex = kitSpecDraftRows.findIndex((row, index) => index !== rowIndex && String(row?.ingredientId || '').trim() === ingredientId);
      if (duplicateIndex >= 0) {
        kitSpecDraftRows[rowIndex].ingredientId = '';
        if (!String(kitSpecDraftRows[rowIndex].qtyPerProduct || '').trim()) {
          kitSpecDraftRows[rowIndex].qtyPerProduct = '';
        }
        setStatus('Each ingredient can only be selected once for the same product kit spec.');
        renderKitSpecEditor();
        return;
      }

      if (!String(kitSpecDraftRows[rowIndex].qtyPerProduct || '').trim()) {
        const selectedIngredient = getKitSpecIngredientById(ingredientId);
        const availableQty = Number(selectedIngredient?.qtyOnHand || 0);
        if (availableQty > 0) {
          kitSpecDraftRows[rowIndex].qtyPerProduct = String(Number(Math.min(1, availableQty).toFixed(3)));
        }
      }

      enforceKitSpecDraftQtyLimit(rowIndex, { showStatus: true });
      renderKitSpecEditor();
      return;
    }

    renderKitSpecEditor();
    return;
  }

  if (fieldName === 'qtyPerProduct') {
    const didClamp = enforceKitSpecDraftQtyLimit(rowIndex, { showStatus: true });
    if (didClamp) {
      renderKitSpecEditor();
    }
    return;
  }

  if (fieldName) {
    renderKitSpecEditor();
  }
}

async function saveKitSpecForSelectedProduct() {
  const productId = String(kitSpecProductSelectEl?.value || '').trim();
  if (!productId) {
    setStatus('Select a product first before saving the kit specification.');
    return;
  }

  updateKitSpecDraftFromEditor();
  const recipeItems = [];
  for (const row of kitSpecDraftRows) {
    const ingredientId = String(row.ingredientId || '').trim();
    const rawQty = String(row.qtyPerProduct || '').trim();
    if (!ingredientId && !rawQty) continue;
    const qtyPerProduct = Number(rawQty);
    if (!ingredientId) {
      setStatus('Each kit spec row must have an ingredient selected.');
      return;
    }
    if (!Number.isFinite(qtyPerProduct) || qtyPerProduct <= 0) {
      setStatus('Each kit spec row must have a quantity greater than 0.');
      return;
    }
    const ingredient = getKitSpecIngredientById(ingredientId);
    if (ingredient) {
      const availableQty = Number(ingredient.qtyOnHand || 0);
      const ingredientName = String(ingredient.name || 'Ingredient').trim() || 'Ingredient';
      const ingredientUnit = String(ingredient.unit || 'pcs').trim() || 'pcs';
      if (availableQty <= 0) {
        setStatus(`Warning: ${ingredientName} has no stock on hand. Restock it before saving this kit spec.`);
        return;
      }
      if (qtyPerProduct > availableQty) {
        setStatus(`Warning: Qty per product for "${ingredientName}" cannot exceed ${formatKitSpecQtyValue(availableQty)} ${ingredientUnit}.`);
        return;
      }
    }
    recipeItems.push({ ingredientId, qtyPerProduct });
  }

  const selectedProduct = (state.products || []).find((product) => String(product.id || '') === productId);
  if (!selectedProduct) {
    setStatus('Selected product was not found.');
    return;
  }

  try {
    if (kitSpecSaveBtnEl) {
      kitSpecSaveBtnEl.disabled = true;
      kitSpecSaveBtnEl.textContent = 'Saving...';
    }
    const result = await api(`/api/admin/kit-spec/${encodeURIComponent(productId)}`, {
      method: 'PUT',
      headers: buildActorHeaders(),
      body: JSON.stringify({ recipeItems })
    });
    kitSpecRecipes = kitSpecRecipes
      .filter((recipe) => String(recipe.productId || '') !== productId)
      .concat(Array.isArray(result?.recipes) ? result.recipes : []);
    loadKitSpecDraftRowsForSelectedProduct();
    renderKitSpecEditor();
    renderKitSpecCoverage();
    await refreshInventoryModule();
    setStatus(`Kit specification saved for ${selectedProduct.name}.`);
  } catch (error) {
    setStatus(`Save kit specification failed: ${error.message}`);
  } finally {
    if (kitSpecSaveBtnEl) {
      kitSpecSaveBtnEl.disabled = false;
      kitSpecSaveBtnEl.textContent = 'Save Kit Spec';
    }
  }
}

function formatRoleLabel(role) {
  const key = String(role || '').trim().toLowerCase();
  if (key === 'administrations') return 'Administrations';
  if (key === 'supervisor') return 'Supervisor';
  if (key === 'encharge') return 'Encharge';
  return key || 'Unknown';
}

function buildUserManagementHeaders() {
  return buildActorHeaders();
}

async function refreshAdminUsers() {
  if (adminUsersSummaryEl) adminUsersSummaryEl.innerHTML = '<div class="user-management-summary-loading">Loading users...</div>';
  if (adminUsersListEl) adminUsersListEl.innerHTML = '<p>Loading users...</p>';
  renderRoleAccessManager();

  if (!canViewUserDirectory()) {
    if (adminUsersSummaryEl) adminUsersSummaryEl.innerHTML = '<p class="error">Current role does not have user directory access.</p>';
    if (adminUsersListEl) adminUsersListEl.innerHTML = '';
    return;
  }

  try {
    const result = await api('/api/admin/users', {
      headers: buildUserManagementHeaders()
    });
    const users = Array.isArray(result?.users) ? result.users : [];
    const activeCount = users.filter((x) => x.isActive).length;
    const canManage = canManageUsers();

    if (adminCreateUserNoteEl) {
      adminCreateUserNoteEl.textContent = canManage
        ? 'Create a user account and set the initial login password.'
        : 'View-only mode. Current role can review accounts and access lists, but cannot change users.';
    }
    if (adminCreateUserFormEl) {
      adminCreateUserFormEl.style.display = canManage ? 'grid' : 'none';
    }

    if (adminUsersSummaryEl) {
      const roleCounts = {
        administrations: users.filter((user) => String(user.role || '').trim().toLowerCase() === 'administrations').length,
        supervisor: users.filter((user) => String(user.role || '').trim().toLowerCase() === 'supervisor').length,
        encharge: users.filter((user) => String(user.role || '').trim().toLowerCase() === 'encharge').length
      };
      const summaryCards = [
        {
          label: 'Total Users',
          value: Number(users.length || 0).toLocaleString('en-US'),
          icon: '👥',
          accent: 'users',
          meta: 'All registered POS accounts'
        },
        {
          label: 'Active',
          value: Number(activeCount || 0).toLocaleString('en-US'),
          icon: '🟢',
          accent: 'active',
          meta: 'Accounts currently enabled'
        },
        {
          label: 'Inactive',
          value: Number((users.length - activeCount) || 0).toLocaleString('en-US'),
          icon: '⏸',
          accent: 'inactive',
          meta: 'Accounts currently disabled'
        },
        {
          label: 'Admins',
          value: Number(roleCounts.administrations || 0).toLocaleString('en-US'),
          icon: '🛡',
          accent: 'admins',
          meta: canManage ? 'You can manage roles, account status, and password resets. Built-in role functions are listed below.' : 'View-only mode. Built-in role functions are listed below for review.'
        }
      ];

      adminUsersSummaryEl.innerHTML = `
        <div class="user-management-summary-shell">
          <div class="user-management-summary-header">
            <span class="user-management-summary-eyebrow">User Overview</span>
            <h3>Account Status Snapshot</h3>
          </div>
          <div class="user-management-summary-grid">
            ${summaryCards.map((card) => `
              <article class="user-management-summary-card ${escapeHtml(card.accent)}">
                <div class="user-management-summary-card-head">
                  <span class="user-management-summary-icon" aria-hidden="true">${card.icon}</span>
                  <span class="user-management-summary-label">${escapeHtml(card.label)}</span>
                </div>
                <strong>${escapeHtml(card.value)}</strong>
                <small>${escapeHtml(card.meta)}</small>
              </article>
            `).join('')}
          </div>
          <div class="user-management-role-strip">
            <span><strong>${Number(roleCounts.administrations || 0).toLocaleString('en-US')}</strong> Administrations</span>
            <span><strong>${Number(roleCounts.supervisor || 0).toLocaleString('en-US')}</strong> Supervisor</span>
            <span><strong>${Number(roleCounts.encharge || 0).toLocaleString('en-US')}</strong> Encharge</span>
          </div>
        </div>
      `;
    }

    if (!adminUsersListEl) return;
    if (!users.length) {
      adminUsersListEl.innerHTML = '<p>No users found.</p>';
      return;
    }

    const rows = users
      .map((user) => {
        const roleOptions = ['administrations', 'supervisor', 'encharge']
          .map((roleKey) => `<option value="${escapeHtml(roleKey)}" ${roleKey === user.role ? 'selected' : ''}>${escapeHtml(formatRoleLabel(roleKey))}</option>`)
          .join('');
        const actionsMarkup = canManage
          ? `
            <div class="user-management-actions" data-user-id="${escapeHtml(user.id)}">
              <div class="user-management-action-row">
                <select class="user-role-select">${roleOptions}</select>
                <button type="button" class="secondary" data-user-save-role="${escapeHtml(user.id)}">Save Role</button>
              </div>
              <div class="user-management-action-row">
                <button
                  type="button"
                  class="secondary"
                  data-user-toggle-active="${escapeHtml(user.id)}"
                  data-next-active="${user.isActive ? 'false' : 'true'}"
                >
                  ${user.isActive ? 'Deactivate' : 'Activate'}
                </button>
              </div>
              <div class="user-management-action-row password-reset-row">
                <input type="password" class="user-reset-password-input" placeholder="Temp password (min 6)" />
                <button type="button" class="secondary" data-user-reset-password="${escapeHtml(user.id)}">Reset Password</button>
              </div>
            </div>
          `
          : '<span class="status">View only</span>';
        return `
        <tr>
          <td><strong>${escapeHtml(user.fullName || 'Unknown')}</strong></td>
          <td class="user-management-email">${escapeHtml(user.email || '-')}</td>
          <td>${escapeHtml(formatRoleLabel(user.role))}</td>
          <td>${user.isActive ? '<span class="badge badge-paid">Active</span>' : '<span class="badge badge-pending">Inactive</span>'}</td>
          <td>${escapeHtml(formatDate(user.lastLoginAt))}</td>
          <td>${escapeHtml(formatDate(user.createdAt))}</td>
          <td>${actionsMarkup}</td>
        </tr>
      `;
      })
      .join('');

    adminUsersListEl.innerHTML = `
      <table class="inventory-table user-management-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
  } catch (error) {
    if (adminUsersSummaryEl) adminUsersSummaryEl.innerHTML = `<p class="error">User management error: ${escapeHtml(error.message)}</p>`;
    if (adminUsersListEl) adminUsersListEl.innerHTML = '';
  }
}

async function handleAdminCreateUserSubmit(event) {
  event.preventDefault();
  if (!canManageUsers()) {
    setStatus('Current role does not have permission to create users.');
    return;
  }

  const fullName = String(adminCreateUserNameEl?.value || '').trim();
  const email = normalizeEmail(adminCreateUserEmailEl?.value);
  const password = String(adminCreateUserPasswordEl?.value || '');
  const role = String(adminCreateUserRoleEl?.value || '').trim().toLowerCase();

  if (!fullName || !email || !password || !role) {
    setStatus('Name, email, password, and role are required.');
    return;
  }
  if (!isValidEmail(email)) {
    setStatus('Enter a valid email format for login.');
    return;
  }
  if (password.length < 6) {
    setStatus('Initial password must be at least 6 characters.');
    return;
  }
  if (!['administrations', 'supervisor', 'encharge'].includes(role)) {
    setStatus('Select a valid role.');
    return;
  }

  try {
    if (adminCreateUserBtnEl) {
      adminCreateUserBtnEl.disabled = true;
      adminCreateUserBtnEl.textContent = 'Creating...';
    }

    const result = await api('/api/admin/users', {
      method: 'POST',
      headers: buildUserManagementHeaders(),
      body: JSON.stringify({ fullName, email, password, role })
    });

    if (adminCreateUserNameEl) adminCreateUserNameEl.value = '';
    if (adminCreateUserEmailEl) adminCreateUserEmailEl.value = '';
    if (adminCreateUserPasswordEl) adminCreateUserPasswordEl.value = '';
    if (adminCreateUserRoleEl) adminCreateUserRoleEl.value = 'encharge';

    const createdEmail = String(result?.user?.email || email);
    setStatus(`User created for ${createdEmail}.`);
    showConfirmationToast({
      title: 'User created',
      message: 'User account created successfully.',
      tone: 'success',
      duration: 4500
    });
    await refreshAdminUsers();
  } catch (error) {
    setStatus(`Create user failed: ${error.message}`);
    showConfirmationToast({
      title: 'Create user failed',
      message: error.message,
      tone: 'warning'
    });
  } finally {
    if (adminCreateUserBtnEl) {
      adminCreateUserBtnEl.disabled = false;
      adminCreateUserBtnEl.textContent = 'Create User';
    }
  }
}

async function handleAdminUsersAction(event) {
  const roleBtn = event.target.closest('[data-user-save-role]');
  if (roleBtn) {
    if (!canManageUsers()) {
      setStatus('Current role does not have permission to update user roles.');
      return;
    }
    const userId = String(roleBtn.getAttribute('data-user-save-role') || '').trim();
    if (!userId) return;
    const row = roleBtn.closest('tr');
    const roleSelect = row?.querySelector('.user-role-select');
    const role = String(roleSelect?.value || '').trim().toLowerCase();
    if (!role) return;

    try {
      roleBtn.disabled = true;
      roleBtn.textContent = 'Saving...';
      await api(`/api/admin/users/${encodeURIComponent(userId)}/role`, {
        method: 'PATCH',
        headers: buildUserManagementHeaders(),
        body: JSON.stringify({ role })
      });
      await refreshAdminUsers();
      setStatus('User role updated.');
    } catch (error) {
      setStatus(`Update role failed: ${error.message}`);
    } finally {
      roleBtn.disabled = false;
      roleBtn.textContent = 'Save Role';
    }
    return;
  }

  const toggleBtn = event.target.closest('[data-user-toggle-active]');
  if (toggleBtn) {
    if (!canManageUsers()) {
      setStatus('Current role does not have permission to activate or deactivate users.');
      return;
    }
    const userId = String(toggleBtn.getAttribute('data-user-toggle-active') || '').trim();
    const nextActive = String(toggleBtn.getAttribute('data-next-active') || '').trim() === 'true';
    if (!userId) return;

    try {
      toggleBtn.disabled = true;
      toggleBtn.textContent = 'Saving...';
      await api(`/api/admin/users/${encodeURIComponent(userId)}/status`, {
        method: 'PATCH',
        headers: buildUserManagementHeaders(),
        body: JSON.stringify({ isActive: nextActive })
      });
      await refreshAdminUsers();
      setStatus(`User account ${nextActive ? 'activated' : 'deactivated'}.`);
    } catch (error) {
      setStatus(`Update status failed: ${error.message}`);
    } finally {
      toggleBtn.disabled = false;
    }
    return;
  }

  const resetBtn = event.target.closest('[data-user-reset-password]');
  if (resetBtn) {
    if (!canManageUsers()) {
      setStatus('Current role does not have permission to reset user passwords.');
      return;
    }
    const userId = String(resetBtn.getAttribute('data-user-reset-password') || '').trim();
    if (!userId) return;
    const row = resetBtn.closest('tr');
    const passwordInput = row?.querySelector('.user-reset-password-input');
    const password = String(passwordInput?.value || '');
    if (password.length < 6) {
      setStatus('Temporary password must be at least 6 characters.');
      return;
    }

    try {
      resetBtn.disabled = true;
      resetBtn.textContent = 'Resetting...';
      await api(`/api/admin/users/${encodeURIComponent(userId)}/reset-password`, {
        method: 'POST',
        headers: buildUserManagementHeaders(),
        body: JSON.stringify({ password })
      });
      if (passwordInput) passwordInput.value = '';
      setStatus('User password reset completed.');
      showConfirmationToast({
        title: 'Password reset',
        message: 'Temporary password was updated successfully.',
        tone: 'success'
      });
    } catch (error) {
      setStatus(`Reset password failed: ${error.message}`);
    } finally {
      resetBtn.disabled = false;
      resetBtn.textContent = 'Reset Password';
    }
  }
}

async function handleRoleAccessManagerClick(event) {
  const removeBtn = event.target.closest('[data-role-access-remove]');
  if (!removeBtn) return;
  const roleKey = String(removeBtn.getAttribute('data-role-access-remove') || '').trim().toLowerCase();
  const permissionKey = String(removeBtn.getAttribute('data-role-access-key') || '').trim().toLowerCase();
  if (!roleKey || !permissionKey) return;

  const entry = getRoleAccessCatalogEntry(permissionKey);
  if (!entry) return;

  try {
    removeBtn.disabled = true;
    removeBtn.textContent = 'Removing...';
    await updateRoleAccessConfig(roleKey, (entries) => entries.filter((key) => key !== permissionKey));
  } catch (error) {
    setStatus(`Role access update failed: ${error.message}`);
  } finally {
    removeBtn.disabled = false;
    removeBtn.textContent = 'Remove';
  }
}

async function handleRoleAccessManagerSubmit(event) {
  const formEl = event.target.closest('[data-role-access-form]');
  if (!formEl) return;
  event.preventDefault();

  const roleKey = String(formEl.getAttribute('data-role-access-form') || '').trim().toLowerCase();
  const selectEl = formEl.querySelector('[data-role-access-select]');
  const permissionKey = String(selectEl?.value || '').trim().toLowerCase();
  if (!roleKey || !permissionKey) return;

  const submitBtn = formEl.querySelector('button[type="submit"]');
  try {
    if (submitBtn instanceof HTMLButtonElement) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Adding...';
    }
    await updateRoleAccessConfig(roleKey, (entries) => entries.concat(permissionKey));
  } catch (error) {
    setStatus(`Role access update failed: ${error.message}`);
  } finally {
    if (submitBtn instanceof HTMLButtonElement) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add';
    }
  }
}

async function handleIngredientSubmit(event) {
  event.preventDefault();
  if (!canManageInventory()) {
    setStatus('Current role does not have permission to add ingredients.');
    return;
  }

  const name = String(ingredientNameInputEl?.value || '').trim();
  const qtyOnHand = Number(ingredientQtyInputEl?.value || 0);
  const unitPrice = Number(ingredientPriceInputEl?.value || 0);
  const unit = String(ingredientUnitInputEl?.value || '').trim();

  if (!name) {
    setStatus('Ingredient name is required.');
    return;
  }
  if (!Number.isFinite(qtyOnHand) || qtyOnHand < 0) {
    setStatus('Quantity must be a valid number >= 0.');
    return;
  }
  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    setStatus('Unit price must be a valid number >= 0.');
    return;
  }
  if (!unit) {
    setStatus('UOM / unit of measure is required.');
    return;
  }

  try {
    if (ingredientAddBtn) {
      ingredientAddBtn.disabled = true;
      ingredientAddBtn.textContent = 'Adding...';
    }

    await api('/api/admin/inventory/ingredients', {
      method: 'POST',
      headers: {
        'x-user-role': String(activeAuthSession?.role || '')
      },
      body: JSON.stringify({ name, qtyOnHand, unitPrice, unit })
    });

    if (ingredientNameInputEl) ingredientNameInputEl.value = '';
    if (ingredientQtyInputEl) ingredientQtyInputEl.value = '';
    if (ingredientPriceInputEl) ingredientPriceInputEl.value = '';
    if (ingredientUnitInputEl) ingredientUnitInputEl.value = '';
    await refreshInventoryModule();
    await refreshKitSpecModule();
    setStatus(`Ingredient "${name}" added successfully.`);
  } catch (error) {
    setStatus(`Add ingredient failed: ${error.message}`);
  } finally {
    if (ingredientAddBtn) {
      ingredientAddBtn.disabled = false;
      ingredientAddBtn.textContent = 'Add Ingredient';
    }
  }
}

function resetInventoryBulkEditorInputs() {
  if (!inventoryBulkEditorEl) return;
  inventoryBulkEditorEl.querySelectorAll('.inventory-bulk-qty-input, .inventory-bulk-price-input').forEach((input) => {
    input.value = '';
  });
  const bulkStatusEl = inventoryBulkEditorEl.querySelector('#inventoryBulkStatus');
  if (bulkStatusEl) bulkStatusEl.textContent = 'Blank fields remain unchanged.';
}

function syncInventoryBulkToggleButton() {
  if (!inventoryBulkToggleBtnEl) return;
  const canShow = canManageInventory() && activeInventoryView === 'ingredients';
  inventoryBulkToggleBtnEl.style.display = canShow ? '' : 'none';
  inventoryBulkToggleBtnEl.textContent = inventoryBulkEditorOpen ? 'Hide Bulk Edit' : 'Bulk Edit';
  inventoryBulkToggleBtnEl.setAttribute('aria-expanded', inventoryBulkEditorOpen ? 'true' : 'false');
  inventoryBulkToggleBtnEl.classList.toggle('active', inventoryBulkEditorOpen);
}

function toggleInventoryBulkEditor() {
  if (!canManageInventory() || activeInventoryView !== 'ingredients') return;
  inventoryBulkEditorOpen = !inventoryBulkEditorOpen;
  syncInventoryBulkToggleButton();
  if (latestInventoryReportData) {
    renderInventoryReport(latestInventoryReportData);
    return;
  }
  refreshInventoryModule().catch((error) => {
    inventoryBulkEditorOpen = false;
    syncInventoryBulkToggleButton();
    setStatus(`Inventory refresh failed: ${error.message}`);
  });
}

async function handleInventoryBulkEditSubmit(event) {
  event.preventDefault();
  if (!canManageInventory()) {
    setStatus('Current role does not have permission to bulk edit ingredients.');
    return;
  }
  if (!inventoryBulkEditorEl) return;

  const bulkStatusEl = inventoryBulkEditorEl.querySelector('#inventoryBulkStatus');
  const bulkApplyBtnEl = inventoryBulkEditorEl.querySelector('#inventoryBulkApplyBtn');
  const qtyMode = String(inventoryBulkEditorEl.querySelector('#inventoryBulkQtyMode')?.value || 'replace').trim().toLowerCase();
  const rows = Array.from(inventoryBulkEditorEl.querySelectorAll('[data-bulk-ingredient-id]'));

  const updates = [];
  for (const row of rows) {
    const ingredientId = String(row.getAttribute('data-bulk-ingredient-id') || '').trim();
    const name = String(row.getAttribute('data-bulk-name') || '').trim();
    const unit = String(row.getAttribute('data-bulk-unit') || '').trim() || 'pcs';
    const currentQty = Number(row.getAttribute('data-bulk-qty') || 0);
    const currentPrice = Number(row.getAttribute('data-bulk-price') || 0);
    const qtyRaw = String(row.querySelector('.inventory-bulk-qty-input')?.value || '').trim();
    const priceRaw = String(row.querySelector('.inventory-bulk-price-input')?.value || '').trim();
    if (!ingredientId || (!qtyRaw && !priceRaw)) continue;

    let qtyOnHand = currentQty;
    let unitPrice = currentPrice;

    if (qtyRaw) {
      const parsedQty = Number(qtyRaw);
      if (!Number.isFinite(parsedQty) || parsedQty < 0) {
        if (bulkStatusEl) bulkStatusEl.textContent = `Invalid qty for "${name}". Use a number greater than or equal to 0.`;
        return;
      }
      qtyOnHand = qtyMode === 'add'
        ? Math.round((currentQty + parsedQty) * 1000) / 1000
        : parsedQty;
    }

    if (priceRaw) {
      const parsedPrice = Number(priceRaw);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        if (bulkStatusEl) bulkStatusEl.textContent = `Invalid unit price for "${name}". Use a number greater than or equal to 0.`;
        return;
      }
      unitPrice = Math.round(parsedPrice * 100) / 100;
    }

    updates.push({
      ingredientId,
      name,
      unit,
      qtyOnHand,
      unitPrice
    });
  }

  if (!updates.length) {
    if (bulkStatusEl) bulkStatusEl.textContent = 'No bulk changes entered yet.';
    return;
  }

  try {
    if (bulkApplyBtnEl) {
      bulkApplyBtnEl.disabled = true;
      bulkApplyBtnEl.textContent = 'Applying...';
    }
    if (bulkStatusEl) bulkStatusEl.textContent = `Applying ${updates.length} ingredient update(s)...`;

    for (const update of updates) {
      await api(`/api/admin/inventory/ingredients/${encodeURIComponent(update.ingredientId)}`, {
        method: 'PUT',
        headers: {
          'x-user-role': String(activeAuthSession?.role || '')
        },
        body: JSON.stringify({
          name: update.name,
          qtyOnHand: update.qtyOnHand,
          unitPrice: update.unitPrice,
          unit: update.unit
        })
      });
    }

    await refreshInventoryModule();
    await refreshKitSpecModule();
    setStatus(`Bulk updated ${updates.length} ingredient(s).`);
  } catch (error) {
    if (bulkStatusEl) bulkStatusEl.textContent = `Bulk update failed: ${error.message}`;
  } finally {
    if (bulkApplyBtnEl) {
      bulkApplyBtnEl.disabled = false;
      bulkApplyBtnEl.textContent = 'Apply Bulk Update';
    }
  }
}

function openInventoryEditModal() {
  if (!inventoryEditModalEl) return;
  inventoryEditModalEl.classList.add('open');
  inventoryEditModalEl.setAttribute('aria-hidden', 'false');
}

function closeInventoryEditModal() {
  if (!inventoryEditModalEl) return;
  inventoryEditModalEl.classList.remove('open');
  inventoryEditModalEl.setAttribute('aria-hidden', 'true');
  inventoryEditContext = null;
  if (inventoryEditStatusEl) inventoryEditStatusEl.textContent = '';
}

function openInventoryDeleteModal() {
  if (!inventoryDeleteModalEl) return;
  inventoryDeleteModalEl.classList.add('open');
  inventoryDeleteModalEl.setAttribute('aria-hidden', 'false');
}

function closeInventoryDeleteModal() {
  if (!inventoryDeleteModalEl) return;
  inventoryDeleteModalEl.classList.remove('open');
  inventoryDeleteModalEl.setAttribute('aria-hidden', 'true');
  inventoryDeleteContext = null;
  if (inventoryDeleteMessageEl) inventoryDeleteMessageEl.textContent = 'Delete this ingredient?';
  if (inventoryDeleteStatusEl) {
    inventoryDeleteStatusEl.textContent = 'This action is only allowed when the ingredient is not assigned to any product.';
  }
  if (inventoryDeleteConfirmBtnEl) {
    inventoryDeleteConfirmBtnEl.disabled = false;
    inventoryDeleteConfirmBtnEl.textContent = 'Delete Ingredient';
  }
}

function openInventoryHistoryModal() {
  if (!inventoryHistoryModalEl) return;
  inventoryHistoryModalEl.classList.add('open');
  inventoryHistoryModalEl.setAttribute('aria-hidden', 'false');
}

function closeInventoryHistoryModal() {
  if (!inventoryHistoryModalEl) return;
  inventoryHistoryModalEl.classList.remove('open');
  inventoryHistoryModalEl.setAttribute('aria-hidden', 'true');
  inventoryHistoryContext = null;
  if (inventoryHistorySummaryEl) inventoryHistorySummaryEl.textContent = 'Loading ingredient history...';
  if (inventoryHistoryTableWrapEl) inventoryHistoryTableWrapEl.innerHTML = '<p>Loading movement history...</p>';
}

async function handleInventoryEditClick(buttonEl) {
  if (!canManageInventory()) {
    setStatus('Current role does not have permission to edit ingredients.');
    return;
  }
  const ingredientId = String(buttonEl?.getAttribute('data-inventory-edit') || '').trim();
  const currentName = String(buttonEl?.getAttribute('data-ingredient-name') || '').trim();
  const currentQty = String(buttonEl?.getAttribute('data-ingredient-qty') || '').trim();
  const currentUnitPrice = String(buttonEl?.getAttribute('data-ingredient-unit-price') || '').trim();
  const currentUnit = String(buttonEl?.getAttribute('data-ingredient-unit') || '').trim();
  const assignedCount = Number(buttonEl?.getAttribute('data-assigned-count') || 0);
  if (!ingredientId) return;
  inventoryEditContext = {
    ingredientId,
    assignedCount,
    originalName: currentName
  };
  if (inventoryEditNameInputEl) inventoryEditNameInputEl.value = currentName;
  if (inventoryEditQtyInputEl) inventoryEditQtyInputEl.value = currentQty;
  if (inventoryEditPriceInputEl) inventoryEditPriceInputEl.value = currentUnitPrice;
  if (inventoryEditUnitInputEl) inventoryEditUnitInputEl.value = currentUnit;
  if (inventoryEditAssignedNoteEl) {
    inventoryEditAssignedNoteEl.textContent = assignedCount > 0
      ? `"${currentName}" is assigned to ${assignedCount} product(s). Updating its name or UOM will also affect the linked kit specifications.`
      : 'This ingredient is not assigned to any product yet. You can update it freely.';
  }
  if (inventoryEditStatusEl) inventoryEditStatusEl.textContent = '';
  openInventoryEditModal();
  if (inventoryEditNameInputEl) inventoryEditNameInputEl.focus();
}

async function handleInventoryEditSubmit(event) {
  event.preventDefault();
  if (!canManageInventory()) {
    setStatus('Current role does not have permission to edit ingredients.');
    return;
  }
  const ingredientId = String(inventoryEditContext?.ingredientId || '').trim();
  if (!ingredientId) return;

  const name = String(inventoryEditNameInputEl?.value || '').trim();
  const qtyOnHand = Number(inventoryEditQtyInputEl?.value || 0);
  const unitPrice = Number(inventoryEditPriceInputEl?.value || 0);
  const unit = String(inventoryEditUnitInputEl?.value || '').trim();

  if (!name) {
    if (inventoryEditStatusEl) inventoryEditStatusEl.textContent = 'Ingredient name is required.';
    if (inventoryEditNameInputEl) inventoryEditNameInputEl.focus();
    return;
  }
  if (!Number.isFinite(qtyOnHand) || qtyOnHand < 0) {
    if (inventoryEditStatusEl) inventoryEditStatusEl.textContent = 'Quantity must be a valid number >= 0.';
    if (inventoryEditQtyInputEl) inventoryEditQtyInputEl.focus();
    return;
  }
  if (!Number.isFinite(unitPrice) || unitPrice < 0) {
    if (inventoryEditStatusEl) inventoryEditStatusEl.textContent = 'Unit price must be a valid number >= 0.';
    if (inventoryEditPriceInputEl) inventoryEditPriceInputEl.focus();
    return;
  }
  if (!unit) {
    if (inventoryEditStatusEl) inventoryEditStatusEl.textContent = 'UOM / unit of measure is required.';
    if (inventoryEditUnitInputEl) inventoryEditUnitInputEl.focus();
    return;
  }

  try {
    if (inventoryEditSaveBtnEl) {
      inventoryEditSaveBtnEl.disabled = true;
      inventoryEditSaveBtnEl.textContent = 'Saving...';
    }
    await api(`/api/admin/inventory/ingredients/${encodeURIComponent(ingredientId)}`, {
      method: 'PUT',
      headers: {
        'x-user-role': String(activeAuthSession?.role || '')
      },
      body: JSON.stringify({ name, qtyOnHand, unitPrice, unit })
    });
    closeInventoryEditModal();
    await refreshInventoryModule();
    await refreshKitSpecModule();
    setStatus(`Ingredient "${name}" updated.`);
  } catch (error) {
    if (inventoryEditStatusEl) inventoryEditStatusEl.textContent = `Update ingredient failed: ${error.message}`;
  } finally {
    if (inventoryEditSaveBtnEl) {
      inventoryEditSaveBtnEl.disabled = false;
      inventoryEditSaveBtnEl.textContent = 'Save Ingredient';
    }
  }
}

async function handleInventoryDeleteClick(buttonEl) {
  if (!canManageInventory()) {
    setStatus('Current role does not have permission to delete ingredients.');
    return;
  }
  const ingredientId = String(buttonEl?.getAttribute('data-inventory-delete') || '').trim();
  const ingredientName = String(buttonEl?.getAttribute('data-ingredient-name') || '').trim() || 'Ingredient';
  const assignedCount = Number(buttonEl?.getAttribute('data-assigned-count') || 0);
  if (!ingredientId) return;
  if (assignedCount > 0) {
    setStatus(`"${ingredientName}" is assigned to ${assignedCount} product(s). Remove it from kit specification first before deleting.`);
    return;
  }

  inventoryDeleteContext = { ingredientId, ingredientName };
  if (inventoryDeleteMessageEl) {
    inventoryDeleteMessageEl.textContent = `Delete ingredient "${ingredientName}"?`;
  }
  if (inventoryDeleteStatusEl) {
    inventoryDeleteStatusEl.textContent = 'This only works when no product is using the ingredient. The record will be removed from Ingredients.';
  }
  openInventoryDeleteModal();
  if (inventoryDeleteConfirmBtnEl) inventoryDeleteConfirmBtnEl.focus();
}

async function handleInventoryHistoryClick(buttonEl) {
  const ingredientId = String(buttonEl?.getAttribute('data-inventory-history') || '').trim();
  const ingredientName = String(buttonEl?.getAttribute('data-ingredient-name') || '').trim() || 'Ingredient';
  const ingredientUnit = String(buttonEl?.getAttribute('data-ingredient-unit') || '').trim() || 'pcs';
  if (!ingredientId) return;

  inventoryHistoryContext = { ingredientId, ingredientName, ingredientUnit };
  if (inventoryHistorySummaryEl) inventoryHistorySummaryEl.textContent = `Loading history for ${ingredientName}...`;
  if (inventoryHistoryTableWrapEl) inventoryHistoryTableWrapEl.innerHTML = '<p>Loading movement history...</p>';
  openInventoryHistoryModal();

  try {
    const result = await api(`/api/admin/inventory/ingredients/${encodeURIComponent(ingredientId)}/history`, {
      headers: {
        'x-user-role': String(activeAuthSession?.role || '')
      }
    });
    const ingredient = result?.ingredient || {};
    const history = Array.isArray(result?.history) ? result.history : [];
    const safeUnit = String(ingredient.unit || ingredientUnit || 'pcs');
    if (inventoryHistorySummaryEl) {
      inventoryHistorySummaryEl.textContent = [
        `Ingredient: ${ingredient.name || ingredientName}`,
        `Current Qty On Hand: ${Number(ingredient.qtyOnHand || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${safeUnit}`,
        `Movement Records: ${history.length}`
      ].join('\n');
    }

    if (inventoryHistoryTableWrapEl) {
      inventoryHistoryTableWrapEl.innerHTML = history.length
        ? `
          <table class="inventory-table inventory-monitor-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Movement</th>
                <th>Qty</th>
                <th>Before</th>
                <th>After</th>
                <th>Reference</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              ${history.map((row) => `
                <tr>
                  <td>${escapeHtml(formatDate(row.createdAt))}</td>
                  <td><span class="inventory-movement-badge ${escapeHtml(String(row.movementType || '').toLowerCase())}">${escapeHtml(String(row.movementType || 'ADJUST'))}</span></td>
                  <td>${Number(row.quantity || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${escapeHtml(safeUnit)}</td>
                  <td>${row.beforeQty === null || row.beforeQty === undefined ? '—' : `${Number(row.beforeQty || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${escapeHtml(safeUnit)}`}</td>
                  <td>${row.afterQty === null || row.afterQty === undefined ? '—' : `${Number(row.afterQty || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${escapeHtml(safeUnit)}`}</td>
                  <td>${escapeHtml(row.invoiceReference ? `Invoice ${row.invoiceReference}` : (row.referenceType || 'Manual'))}</td>
                  <td>${escapeHtml(row.notes || 'Inventory movement')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `
        : '<p>No movement history recorded yet for this ingredient.</p>';
    }
  } catch (error) {
    if (inventoryHistorySummaryEl) inventoryHistorySummaryEl.textContent = `Ingredient history failed: ${error.message}`;
    if (inventoryHistoryTableWrapEl) inventoryHistoryTableWrapEl.innerHTML = '';
  }
}

async function submitInventoryDelete() {
  if (!canManageInventory()) {
    setStatus('Current role does not have permission to delete ingredients.');
    return;
  }
  const ingredientId = String(inventoryDeleteContext?.ingredientId || '').trim();
  const ingredientName = String(inventoryDeleteContext?.ingredientName || '').trim() || 'Ingredient';
  if (!ingredientId) return;
  try {
    if (inventoryDeleteConfirmBtnEl) {
      inventoryDeleteConfirmBtnEl.disabled = true;
      inventoryDeleteConfirmBtnEl.textContent = 'Deleting...';
    }
    await api(`/api/admin/inventory/ingredients/${encodeURIComponent(ingredientId)}`, {
      method: 'DELETE',
      headers: {
        'x-user-role': String(activeAuthSession?.role || '')
      }
    });
    closeInventoryDeleteModal();
    await refreshInventoryModule();
    await refreshKitSpecModule();
    setStatus(`Ingredient "${ingredientName}" deleted.`);
  } catch (error) {
    if (inventoryDeleteStatusEl) inventoryDeleteStatusEl.textContent = `Delete ingredient failed: ${error.message}`;
  } finally {
    if (inventoryDeleteConfirmBtnEl) {
      inventoryDeleteConfirmBtnEl.disabled = false;
      inventoryDeleteConfirmBtnEl.textContent = 'Delete Ingredient';
    }
  }
}

async function refreshSalesReport(range = activeSalesRange, options = {}) {
  try {
    const { refreshSalesOps = true } = options;
    activeSalesRange = range;
    saveUserUiState({ salesRange: activeSalesRange });
    if (!canAccessAdminFeatures()) return;
    if (adminRangeEl) {
      adminRangeEl.value = range;
    }
    
    let url = `/api/admin/overview?range=${encodeURIComponent(range)}`;
    if (range === 'custom_month' && adminMonthPickerEl && adminMonthPickerEl.value) {
      const monthVal = adminMonthPickerEl.value; // e.g. "2026-03"
      const year = parseInt(monthVal.split('-')[0], 10);
      const month = parseInt(monthVal.split('-')[1], 10) - 1; // 0-based
      const from = new Date(year, month, 1, 0, 0, 0);
      const to = new Date(year, month + 1, 0, 23, 59, 59, 999);
      url += `&dateFrom=${encodeURIComponent(from.toISOString())}&dateTo=${encodeURIComponent(to.toISOString())}`;
    }

    const report = await api(url, {
      headers: buildActorHeaders()
    });
    renderSalesReport(report);
    const followUpTasks = [refreshAdminTransactions()];
    if (refreshSalesOps) {
      followUpTasks.push(refreshSalesOpsDashboard(activeSalesOpsRange));
    }
    await Promise.all(followUpTasks);
  } catch (error) {
    latestAdminOverview = null;
    if (salesSummaryEl) salesSummaryEl.textContent = `Sales report error: ${error.message}`;
    if (salesListEl) salesListEl.innerHTML = '';
    if (salesDetailedGridEl) salesDetailedGridEl.innerHTML = '';
    if (topProductsListEl) topProductsListEl.innerHTML = '';
    if (adminMixPanelEl) adminMixPanelEl.innerHTML = '';
    if (adminStatsEl) adminStatsEl.innerHTML = '';
  }
}

async function pollInvoice(invoiceId) {
  if (state.poller) {
    clearInterval(state.poller);
  }

  let pollCount = 0;
  const maxPolls = 90; // 3 minutes at 2s intervals

  state.poller = setInterval(async () => {
    try {
      pollCount++;

      // Every 5th poll, also try to verify directly with PayMongo
      if (pollCount % 5 === 0) {
        try {
          const verifyResult = await api(`/api/payments/ewallet/verify/${invoiceId}`, {
            method: 'POST'
          });
          if (verifyResult.verified || verifyResult.alreadyPaid) {
            clearInterval(state.poller);
            state.poller = null;
            const inv = verifyResult.invoice;
            renderReceipt(inv);
            await refreshSalesReport(activeSalesRange);
            finalizeSuccessfulPayment(inv, 'E-Payment');
            return;
          }
        } catch (verifyErr) {
          // Ignore verify errors, continue polling
        }
      }

      const { invoice } = await api(`/api/invoices/${invoiceId}`);
      if (invoice.status === 'PAID') {
        clearInterval(state.poller);
        state.poller = null;
        renderReceipt(invoice);
        await refreshSalesReport(activeSalesRange);
        finalizeSuccessfulPayment(invoice, 'E-Payment');
      } else if (pollCount >= maxPolls) {
        clearInterval(state.poller);
        state.poller = null;
        setStatus('Payment verification timed out. Check Admin tab to verify manually.');
      }
    } catch (err) {
      setStatus(`Polling error: ${err.message}`);
    }
  }, 2000);
}

async function handleCheckout() {
  try {
    const items = getCartItems();
    if (!items.length) {
      setStatus('Add at least one item first.');
      return;
    }

    const paymentMethod = paymentMethodEl.value;
    const discountAmount = getDiscountAmount();

    if (paymentMethod === 'cash') {
      const tendered = Number(amountTenderedEl?.value || 0);
      if (tendered <= 0) {
        setStatus('Enter customer cash tendered amount.');
        if (amountTenderedEl) amountTenderedEl.focus();
        return;
      }

      try {
        const { invoice } = await api('/api/invoices', {
          method: 'POST',
          body: JSON.stringify({
            items,
            paymentMethod,
            discountAmount,
            discountProfile: normalizeInvoiceDiscountProfile(getSelectedDiscountProfile()),
            orderType: state.orderType,
            ...getCashierInvoiceContext()
          })
        });
        state.activeInvoice = invoice;
        const paid = await api('/api/payments/cash', {
          method: 'POST',
          body: JSON.stringify({ invoiceId: invoice.id, amountTendered: tendered })
        });
        renderReceipt(paid.invoice);
        await refreshSalesReport(activeSalesRange);
        finalizeSuccessfulPayment(paid.invoice, 'Cash');
        return;
      } catch (error) {
        if (!isNetworkLikeError(error)) {
          throw error;
        }
        const queuedInvoice = await queueOfflineCashSale({
          items,
          amountTendered: tendered,
          discountAmount,
          orderType: state.orderType
        });
        renderReceipt(queuedInvoice);
        finalizeSuccessfulPayment(queuedInvoice, 'Cash');
        await refreshConnectivityStatus({ showTransitionToast: false });
        showConfirmationToast({
          title: 'Saved offline',
          message: 'Cash sale stored on this device and will sync automatically when online.',
          tone: 'warning',
          duration: 3400
        });
        return;
      }
    }

    const { invoice } = await api('/api/invoices', {
      method: 'POST',
      body: JSON.stringify({
        items,
        paymentMethod,
        discountAmount,
        discountProfile: normalizeInvoiceDiscountProfile(getSelectedDiscountProfile()),
        orderType: state.orderType,
        ...getCashierInvoiceContext()
      })
    });

    state.activeInvoice = invoice;

    // Collect customer info from the form
    const customerInfo = {};
    const cName = (customerNameEl?.value || '').trim();
    const cEmail = (customerEmailEl?.value || '').trim();
    const cPhone = (customerPhoneEl?.value || '').trim();
    if (cName) customerInfo.name = cName;
    if (cEmail) customerInfo.email = cEmail;
    if (cPhone) customerInfo.phone = cPhone;

    const eWalletMethod = String(paymentMethod).toLowerCase();
    const eWalletLabel = getPaymentMethodLabel(eWalletMethod);
    const { checkout } = await api('/api/payments/ewallet/checkout', {
      method: 'POST',
      body: JSON.stringify({ invoiceId: invoice.id, customerInfo })
    });

    const qrMarkup = checkout.qrDataUrl
      ? `<img class="qr" alt="GCash QR" src="${checkout.qrDataUrl}" />`
      : '<div>No direct QR in POS for this provider. Continue in hosted checkout.</div>';

    gcashInfoEl.innerHTML = `
      <h3>${eWalletLabel} Checkout</h3>
      <div>Gateway: <strong>${String(checkout.provider || '').toUpperCase()}</strong></div>
      <div>Method: <strong>${eWalletLabel}</strong></div>
      <div>Reference: ${checkout.reference}</div>
      ${qrMarkup}
      <div class="row">
        <button id="openCheckout" class="secondary">Open Hosted Checkout</button>
      </div>
    `;

    const openBtn = document.getElementById('openCheckout');
    if (openBtn) {
      openBtn.addEventListener('click', () => {
        window.open(checkout.checkoutUrl, '_blank', 'noopener');
      });
    }

    const hostedCheckoutWindow = window.open(checkout.checkoutUrl, '_blank', 'noopener');
    if (!hostedCheckoutWindow) {
      showConfirmationToast({
        title: 'Popup blocked',
        message: 'Use the "Open Hosted Checkout" button to continue the payment.',
        tone: 'warning',
        duration: 3200
      });
    }
    setStatus(`${eWalletLabel} checkout created via ${String(checkout.provider || '').toUpperCase()}. Waiting for payment...\nReference: ${checkout.reference}\n\nPayment will be auto-verified every 10 seconds.`);

    await pollInvoice(invoice.id);
  } catch (error) {
    setStatus(`Checkout error: ${error.message}`);
  }
}

function onPaymentMethodChange() {
  const isCash = paymentMethodEl.value === 'cash';
  if (cashRowEl) {
    cashRowEl.style.display = (isCash && state.cashPromptActive) ? 'flex' : 'none';
  }
}

// ------------------------------------------
// Admin / Transactions Functions
// ------------------------------------------

async function refreshAdminTransactions() {
  try {
    const filterStatus = adminFilterEl.value;
    const range = adminRangeEl.value;

    let url = '/api/admin/transactions?';
    if (filterStatus) url += `status=${encodeURIComponent(filterStatus)}&`;
    if (range) url += `range=${encodeURIComponent(range)}&`;
    
    if (range === 'custom_month' && adminMonthPickerEl && adminMonthPickerEl.value) {
      const monthVal = adminMonthPickerEl.value; // e.g. "2026-03"
      const year = parseInt(monthVal.split('-')[0], 10);
      const month = parseInt(monthVal.split('-')[1], 10) - 1; // 0-based
      const from = new Date(year, month, 1, 0, 0, 0);
      const to = new Date(year, month + 1, 0, 23, 59, 59, 999);
      url += `dateFrom=${encodeURIComponent(from.toISOString())}&dateTo=${encodeURIComponent(to.toISOString())}&`;
    }

    const { transactions } = await api(url, {
      headers: buildActorHeaders()
    });
    renderAdminTransactions(transactions);
  } catch (error) {
    adminTransactionsEl.innerHTML = `<p class="error">Error loading transactions: ${error.message}</p>`;
  }
}

async function requestHoldForVoid(invoiceId = null) {
  const targetInvoiceId = String(invoiceId || state.lastPaidInvoice?.id || '').trim();
  if (!targetInvoiceId) {
    setStatus('No paid receipt is available to hold for void.');
    return;
  }

  const reason = String(window.prompt('Enter the note for admin review before this receipt is voided:', '') || '').trim();
  if (!reason) {
    setStatus('A note is required to place a receipt on hold for void.');
    return;
  }

  try {
    const { invoice } = await api(`/api/admin/invoices/${encodeURIComponent(targetInvoiceId)}/status`, {
      method: 'PATCH',
      headers: buildActorHeaders(),
      body: JSON.stringify({
        status: 'HOLD_FOR_VOID',
        reason
      })
    });
    if (state.lastPaidInvoice && String(state.lastPaidInvoice.id || '') === targetInvoiceId) {
      state.lastPaidInvoice = invoice;
      renderReceipt(invoice);
      renderPaymentReceiptModal(invoice);
    }
    if (state.activeInvoice && String(state.activeInvoice.id || '') === targetInvoiceId) {
      state.activeInvoice = invoice;
    }
    setStatus('Receipt placed on hold for admin void review.');
    try {
      const summary = await refreshLatestShiftSummary();
      if (shiftMonitorModalEl?.classList.contains('open') && summary) {
        renderShiftSummary(shiftMonitorSummaryEl, summary);
      }
    } catch (_error) {
      // Keep the hold request successful even if the summary refresh fails.
    }
    if (canAccessAdminFeatures()) {
      await Promise.all([
        refreshAdminTransactions(),
        refreshSalesReport(activeSalesRange),
        refreshCashierMonitoring(),
        refreshShiftManagement()
      ]);
    }
  } catch (error) {
    setStatus(`Hold for void failed: ${error.message}`);
  }
}

function renderAdminStats(report) {
  if (!adminStatsEl) return;
  const metrics = report?.metrics || {};
  const comparisons = report?.comparisons || {};

  adminStatsEl.innerHTML = `
    <div class="sales-ops-summary-grid admin-health-grid">
      <article class="sales-ops-summary-card highlight">
        <span>Gross Sales</span>
        <strong>${money(metrics.totalSales || 0)}</strong>
        <small>${formatOverviewDelta(comparisons.sales, money)}</small>
      </article>
      <article class="sales-ops-summary-card">
        <span>Paid Transactions</span>
        <strong>${Number(metrics.paidTransactions || 0)}</strong>
        <small>${formatOverviewCountDelta(comparisons.transactions)}</small>
      </article>
      <article class="sales-ops-summary-card">
        <span>Average Ticket</span>
        <strong>${money(metrics.averageTicket || 0)}</strong>
        <small>${formatOverviewDelta(comparisons.averageTicket, money)}</small>
      </article>
      <article class="sales-ops-summary-card">
        <span>Items Sold</span>
        <strong>${Number(metrics.itemsSold || 0)}</strong>
        <small>${formatOverviewCountDelta(comparisons.itemsSold)}</small>
      </article>
      <article class="sales-ops-summary-card">
        <span>Net Cash</span>
        <strong>${money(metrics.netCash || 0)}</strong>
        <small>Tendered ${money(metrics.cashTendered || 0)} | Change ${money(metrics.changeGiven || 0)}</small>
      </article>
      <article class="sales-ops-summary-card">
        <span>Monthly Net After Expenses</span>
        <strong>${money(metrics.monthlyNetAfterExpenses || 0)}</strong>
        <small>Monthly expenses ${money(metrics.monthlyExpenses || 0)}</small>
      </article>
      <article class="sales-ops-summary-card">
        <span>Pending Payments</span>
        <strong>${Number(metrics.pendingTransactions || 0)}</strong>
        <small>Invoices waiting for payment confirmation</small>
      </article>
      <article class="sales-ops-summary-card">
        <span>Voided Sales</span>
        <strong>${Number(metrics.voidedTransactions || 0)}</strong>
        <small>${money(metrics.voidedAmount || 0)} total amount voided in this range</small>
      </article>
      <article class="sales-ops-summary-card">
        <span>Discrepancy Alerts</span>
        <strong>${Number(metrics.discrepancyAlerts || 0)}</strong>
        <small>Shift reviews needing reconciliation</small>
      </article>
      <article class="sales-ops-summary-card">
        <span>Unsynced Operations</span>
        <strong>${Number(metrics.unsyncedOperations || 0)}</strong>
        <small>Offline queue items waiting to sync</small>
      </article>
    </div>
  `;
}

function renderAdminTransactions(transactions) {
  if (!transactions.length) {
    if (adminRangeEl && adminRangeEl.value === 'custom_month') {
      const monthVal = adminMonthPickerEl ? adminMonthPickerEl.value : '';
      adminTransactionsEl.innerHTML = `<p>No transactions found for the selected month${monthVal ? ` (${escapeHtml(monthVal)})` : ''}.</p>`;
    } else {
      adminTransactionsEl.innerHTML = '<p>No transactions found.</p>';
    }
    return;
  }

  const rows = transactions.map((t) => {
    const normalizedStatus = String(t.status || '').toUpperCase();
    const statusClass = normalizedStatus === 'PAID'
      ? 'badge-paid'
      : normalizedStatus === 'HOLD_FOR_VOID'
        ? 'badge-hold-void'
      : normalizedStatus === 'CANCELLED'
        ? 'badge-cancelled'
        : normalizedStatus === 'VOIDED'
          ? 'badge-voided'
          : 'badge-pending';
    const methodClass = t.paymentMethod === 'cash' ? 'badge-cash' : 'badge-gcash';

    const verifyBtn = (normalizedStatus === 'PENDING' && t.paymentMethod !== 'cash')
      ? `<button class="verify-btn small" data-verify="${t.id}">Verify</button>`
      : '';
    const receiptBtn = (normalizedStatus === 'PAID' || normalizedStatus === 'HOLD_FOR_VOID' || normalizedStatus === 'VOIDED')
      ? `<button class="secondary small" data-receipt="${t.id}">Receipt</button>`
      : '';
    const voidBtn = (normalizedStatus === 'PAID' || normalizedStatus === 'HOLD_FOR_VOID')
      ? `<button class="secondary small" data-invoice-status="${t.id}" data-next-status="VOIDED">Void</button>`
      : '';

    const paidInfo = t.payment
      ? `<div class="txn-paid-info">Sale: ${money(t.total || 0)} | Tendered: ${money(t.payment.amountPaid || 0)} | Change: ${money(t.payment.change || 0)} at ${formatDate(t.payment.paidAt)}</div>`
      : '';
    const lifecycleInfo = (normalizedStatus === 'CANCELLED' || normalizedStatus === 'VOIDED' || normalizedStatus === 'HOLD_FOR_VOID')
      ? `<div class="txn-paid-info">${escapeHtml(getOverviewMixLabel(normalizedStatus))}${t.statusReason ? `: ${escapeHtml(t.statusReason)}` : ''}${t.statusChangedAt ? ` • ${escapeHtml(formatDate(t.statusChangedAt))}` : ''}${t.statusChangedByEmail ? ` • ${escapeHtml(t.statusChangedByEmail)}` : ''}</div>`
      : '';

    // Customer information from PayMongo billing
    let customerInfoHtml = '';
    if (t.payment) {
      const name = t.payment.customerName;
      const email = t.payment.customerEmail;
      const phone = t.payment.customerPhone;

      if (name || email || phone) {
        customerInfoHtml = `
          <div class="txn-customer">
            <div class="txn-customer-label">Customer Info:</div>
            ${name ? `<div class="txn-customer-field"><span class="field-icon">??</span> ${escapeHtml(name)}</div>` : ''}
            ${email ? `<div class="txn-customer-field"><span class="field-icon">??</span> ${escapeHtml(email)}</div>` : ''}
            ${phone ? `<div class="txn-customer-field"><span class="field-icon">??</span> ${escapeHtml(phone)}</div>` : ''}
          </div>
        `;
      }
    }

    return `
      <div class="txn-row">
        <div class="txn-main">
          <button class="txn-ref receipt-link" data-receipt="${t.id}">${t.reference}</button>
          <div class="txn-badges">
            <span class="badge ${statusClass}">${escapeHtml(getOverviewMixLabel(normalizedStatus) || t.status)}</span>
            <span class="badge ${methodClass} method-badge">
              <img class="payment-method-icon payment-method-icon-${escapeHtml(String(t.paymentMethod || '').toLowerCase())}" src="${getPaymentMethodIcon(t.paymentMethod)}" alt="${getPaymentMethodLabel(t.paymentMethod)}" />
              ${getPaymentMethodLabel(t.paymentMethod)}
            </span>
          </div>
        </div>
        <div class="txn-details">
          <div class="txn-amount">${money(t.total)}</div>
          <div class="txn-date">${formatDate(t.createdAt)}</div>
          ${paidInfo}
          ${lifecycleInfo}
          ${customerInfoHtml}
        </div>
        <div class="txn-actions">
          ${verifyBtn}
          ${receiptBtn}
          ${voidBtn}
        </div>
      </div>
    `;
  });

  adminTransactionsEl.innerHTML = rows.join('');
}

function getAdminRangeSearchParams() {
  const params = new URLSearchParams();
  const range = getAdminRangeQueryValue();
  if (range) params.set('range', range);
  return params;
}

function getSalesOpsRangeSearchParams() {
  const params = new URLSearchParams();
  const range = getSalesOpsRangeQueryValue();
  params.set('range', range);
  if (range === 'custom_month') {
    const bounds = getMonthRangeBounds(getSalesOpsSelectedMonth());
    if (bounds?.dateFrom && bounds?.dateTo) {
      params.set('dateFrom', bounds.dateFrom);
      params.set('dateTo', bounds.dateTo);
    }
  }
  return params;
}

function formatDiscrepancyPill(discrepancy) {
  const value = Number(discrepancy || 0);
  const type = value >= 0 ? 'over' : 'short';
  const label = value >= 0
    ? `Over ${money(Math.abs(value))}`
    : `Short ${money(Math.abs(value))}`;
  return `<span class="discrepancy-pill ${type}">${escapeHtml(label)}</span>`;
}

function formatReviewStatusPill(status) {
  const normalized = String(status || 'pending').trim().toLowerCase() || 'pending';
  const label = normalized === 'approved'
    ? 'Reviewed / Cleared'
    : normalized === 'investigate'
      ? 'Under Investigation'
      : 'Pending Review';
  return `<span class="review-status-pill ${escapeHtml(normalized)}">${escapeHtml(label)}</span>`;
}

function formatReviewDetails(row) {
  const note = String(row?.reviewNote || '').trim();
  const reviewedAt = row?.reviewedAt ? formatDate(row.reviewedAt) : '';
  const reviewedBy = String(row?.reviewedByEmail || '').trim();
  if (!note && !reviewedAt && !reviewedBy) return '—';

  const parts = [];
  if (note) parts.push(escapeHtml(note));
  if (reviewedBy) parts.push(`By ${escapeHtml(reviewedBy)}`);
  if (reviewedAt) parts.push(`At ${escapeHtml(reviewedAt)}`);
  return parts.join('<br />');
}

function renderCashierMonitoring(cashiers = []) {
  if (!cashierMonitoringListEl) return;
  if (!Array.isArray(cashiers) || !cashiers.length) {
    cashierMonitoringListEl.innerHTML = '<p>No active operators right now.</p>';
    return;
  }

  const rows = cashiers.map((row) => `
    <tr>
      <td><strong>${escapeHtml(row.cashierName || 'Operator')}</strong><br /><small>${escapeHtml(formatRoleLabel(row.cashierRole || 'encharge'))} | ${escapeHtml(row.cashierEmail || '-')}</small></td>
      <td>${escapeHtml(row.drawerName || 'Drawer')}</td>
      <td>${escapeHtml(formatDate(row.loginTime))}</td>
      <td>${money(row.startingCash || 0)}</td>
      <td>${money(row.currentSales || 0)}</td>
      <td>${money(row.holdForVoidAmount || 0)}<br /><small>${Number(row.holdForVoidCount || 0)} receipt(s)</small></td>
      <td>${money(row.cashWithdrawals || 0)}</td>
      <td>${money(row.currentDrawerBalance || 0)}</td>
      <td>${Number(row.totalTransactions || 0)}</td>
      <td><span class="cashier-status-badge">${escapeHtml(String(row.status || 'active').toUpperCase())}</span></td>
    </tr>
  `).join('');

  cashierMonitoringListEl.innerHTML = `
    <table class="admin-inline-table">
      <thead>
        <tr>
          <th>Operator</th>
          <th>Drawer</th>
          <th>Shift Start</th>
          <th>Cash on Hand</th>
          <th>Current Sales</th>
          <th>Hold for Void</th>
          <th>Admin Deductions</th>
          <th>Current Drawer Cash</th>
          <th>Transactions</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

async function refreshCashierMonitoring() {
  if (!cashierMonitoringListEl || !canAccessOperationsPanel()) return;
  cashierMonitoringListEl.innerHTML = '<p>Loading active cashiers...</p>';
  try {
    const result = await api('/api/admin/cashiers/active', {
      headers: buildActorHeaders()
    });
    renderCashierMonitoring(Array.isArray(result?.cashiers) ? result.cashiers : []);
  } catch (error) {
    cashierMonitoringListEl.innerHTML = `<p class="error">Cashier monitoring error: ${escapeHtml(error.message)}</p>`;
  }
}

function renderCashDrawerAdmin(result) {
  const drawers = Array.isArray(result?.drawers) ? result.drawers : [];
  const recentMovements = Array.isArray(result?.recentMovements) ? result.recentMovements : [];
  const summary = result?.summary || {};

  if (cashDrawerAdminNoteEl) {
    cashDrawerAdminNoteEl.textContent = canManageCashDrawer()
      ? 'Create drawer names here first. Cashiers will choose from these drawers when starting a shift, and each drawer keeps its own running balance.'
      : 'Drawer balances and movements are visible here. Only Administrations can create drawers or deduct cash.';
  }

  if (cashDrawerCreateFormEl) {
    const canEdit = canManageCashDrawer();
    Array.from(cashDrawerCreateFormEl.elements || []).forEach((element) => {
      if (element instanceof HTMLButtonElement || element instanceof HTMLInputElement) {
        element.disabled = !canEdit;
      }
    });
  }

  if (cashDrawerSummaryEl) {
    const summaryCards = [
      {
        label: 'Registered Drawers',
        value: Number(summary.drawerCount || 0).toLocaleString('en-US'),
        note: 'Named drawers available for shift assignment.'
      },
      {
        label: 'Active Drawers',
        value: Number(summary.activeDrawers || 0).toLocaleString('en-US'),
        note: 'Drawers currently assigned to an active cashier.'
      },
      {
        label: 'Total Drawer Cash',
        value: money(summary.totalCurrentDrawerCash || 0),
        note: 'Combined running balance across all drawers.'
      },
      {
        label: 'Logged Deductions',
        value: money(summary.totalWithdrawals || 0),
        note: 'Recorded cash pull-outs from drawer balances.'
      }
    ];

    cashDrawerSummaryEl.innerHTML = `
      <div class="cash-drawer-summary-shell">
        ${summaryCards.map((card, index) => `
          <article class="cash-drawer-summary-card${index === 2 ? ' highlight' : ''}">
            <span class="cash-drawer-summary-label">${escapeHtml(card.label)}</span>
            <strong class="cash-drawer-summary-value">${escapeHtml(card.value)}</strong>
            <small class="cash-drawer-summary-note">${escapeHtml(card.note)}</small>
          </article>
        `).join('')}
      </div>
    `;
  }

  if (cashDrawerListEl) {
    if (!drawers.length) {
      cashDrawerListEl.innerHTML = '<p>No drawers created yet.</p>';
    } else {
      const rows = drawers.map((drawer) => `
        <tr>
          <td><strong>${escapeHtml(drawer.name || 'Drawer')}</strong></td>
          <td>${money(drawer.currentAmount || 0)}</td>
          <td>${drawer.activeCashierName ? escapeHtml(drawer.activeCashierName) : 'Idle'}</td>
          <td>
            ${canManageCashDrawer()
              ? `
                <div class="inventory-actions">
                  <button class="secondary small" type="button" data-drawer-withdraw="${escapeHtml(drawer.id || '')}" data-drawer-name="${escapeHtml(drawer.name || 'Drawer')}">Deduct Cash</button>
                  <button
                    class="secondary small"
                    type="button"
                    data-drawer-edit="${escapeHtml(drawer.id || '')}"
                    data-drawer-name="${escapeHtml(drawer.name || 'Drawer')}"
                    data-drawer-initial-balance="${escapeHtml(String(Number(drawer.initialBalance || 0)))}"
                    ${drawer.canEdit ? '' : 'disabled title="Edit is only available before this drawer has any transactions or shift history."'}
                  >
                    Edit
                  </button>
                  <button
                    class="secondary small"
                    type="button"
                    data-drawer-delete="${escapeHtml(drawer.id || '')}"
                    data-drawer-name="${escapeHtml(drawer.name || 'Drawer')}"
                    ${drawer.canDelete ? '' : 'disabled title="Delete is only available before this drawer has any transactions or shift history."'}
                  >
                    Delete
                  </button>
                </div>
                ${drawer.canEdit && drawer.canDelete
                  ? ''
                  : '<small class="inventory-assigned-note">Edit/Delete disabled after the first drawer transaction or shift history.</small>'}
              `
              : 'View only'}
          </td>
        </tr>
      `).join('');

      cashDrawerListEl.innerHTML = `
        <table class="admin-inline-table">
          <thead>
            <tr>
              <th>Drawer Name</th>
              <th>Current Amount</th>
              <th>Current Cashier</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      `;
    }
  }

  if (!cashDrawerMovementsListEl) return;
  if (!recentMovements.length) {
    cashDrawerMovementsListEl.innerHTML = '<p>No drawer movements recorded yet.</p>';
    return;
  }

  const movementRows = recentMovements.map((row) => `
    <tr>
      <td>${escapeHtml(formatDate(row.createdAt))}</td>
      <td><strong>${escapeHtml(row.drawerName || 'Drawer')}</strong></td>
      <td>${escapeHtml(String(row.movementType || 'withdrawal').toUpperCase())}</td>
      <td>${money(row.amount || 0)}</td>
      <td>${escapeHtml(row.note || '-')}</td>
      <td>${escapeHtml(row.performedByName || row.performedByEmail || '-')}</td>
    </tr>
  `).join('');

  cashDrawerMovementsListEl.innerHTML = `
    <table class="admin-inline-table">
      <thead>
        <tr>
          <th>Time</th>
          <th>Drawer</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Note</th>
          <th>By</th>
        </tr>
      </thead>
      <tbody>${movementRows}</tbody>
    </table>
  `;
}

async function refreshCashDrawerAdmin() {
  if (!cashDrawerSummaryEl || !canAccessCashDrawerControl()) return;
  if (cashDrawerSummaryEl) cashDrawerSummaryEl.textContent = 'Loading cash drawer summary...';
  if (cashDrawerListEl) cashDrawerListEl.innerHTML = '<p>Loading drawers...</p>';
  if (cashDrawerMovementsListEl) cashDrawerMovementsListEl.innerHTML = '<p>Loading cash drawer activity...</p>';
  try {
    const result = await api('/api/admin/cash-drawer', {
      headers: buildActorHeaders()
    });
    renderCashDrawerAdmin(result);
  } catch (error) {
    if (cashDrawerSummaryEl) cashDrawerSummaryEl.textContent = `Cash drawer error: ${error.message}`;
    if (cashDrawerListEl) cashDrawerListEl.innerHTML = '';
    if (cashDrawerMovementsListEl) cashDrawerMovementsListEl.innerHTML = '';
  }
}

async function handleCashDrawerCreate(event) {
  event.preventDefault();
  if (!canManageCashDrawer()) {
    setStatus('Only Administrations can create drawers.');
    return;
  }

  const name = String(cashDrawerNameInputEl?.value || '').trim();
  const initialBalance = parseNonNegativeAmount(cashDrawerInitialBalanceInputEl?.value);
  if (!name) {
    setStatus('Enter a drawer name.');
    return;
  }
  if (!syncCashDrawerInitialBalanceValidity()) {
    cashDrawerInitialBalanceInputEl?.reportValidity();
    setStatus('Enter a first drawer amount greater than 0.');
    return;
  }
  if (initialBalance === null || initialBalance <= 0) {
    setStatus('Enter a first drawer amount greater than 0.');
    return;
  }

  try {
    if (cashDrawerCreateBtnEl) {
      cashDrawerCreateBtnEl.disabled = true;
      cashDrawerCreateBtnEl.textContent = 'Creating...';
    }
    await api('/api/admin/drawers', {
      method: 'POST',
      headers: buildActorHeaders(),
      body: JSON.stringify({ name, initialBalance })
    });
    if (cashDrawerNameInputEl) cashDrawerNameInputEl.value = '';
    if (cashDrawerInitialBalanceInputEl) cashDrawerInitialBalanceInputEl.value = '';
    setStatus(`Drawer "${name}" created.`);
    await refreshCashDrawerAdmin();
  } catch (error) {
    setStatus(`Create drawer failed: ${error.message}`);
  } finally {
    if (cashDrawerCreateBtnEl) {
      cashDrawerCreateBtnEl.disabled = false;
      cashDrawerCreateBtnEl.textContent = 'Create Drawer';
    }
  }
}

function syncCashDrawerInitialBalanceValidity() {
  if (!cashDrawerInitialBalanceInputEl) return true;
  const rawValue = String(cashDrawerInitialBalanceInputEl.value || '').trim();
  if (!rawValue) {
    cashDrawerInitialBalanceInputEl.setCustomValidity('');
    return true;
  }

  const amount = Number(rawValue);
  if (!Number.isFinite(amount) || amount <= 0) {
    cashDrawerInitialBalanceInputEl.setCustomValidity('Amount must be greater than 0 only.');
    return false;
  }

  cashDrawerInitialBalanceInputEl.setCustomValidity('');
  return true;
}

async function handleCashDrawerWithdrawClick(drawerId, drawerName) {
  if (!canManageCashDrawer()) {
    setStatus('Only Administrations can deduct cash from the drawer.');
    return;
  }
  if (!drawerId) return;

  const rawAmount = window.prompt(`How much will be deducted from ${drawerName || 'this drawer'}?`, '');
  if (rawAmount === null) return;
  const amount = parseNonNegativeAmount(rawAmount);
  if (amount === null || amount <= 0) {
    setStatus('Enter a deduction amount greater than 0.');
    return;
  }

  const note = String(window.prompt('Enter a note for this deduction:', '') || '').trim();
  if (!note) {
    setStatus('A note is required so the deduction is documented.');
    return;
  }

  try {
    await api(`/api/admin/drawers/${encodeURIComponent(drawerId)}/withdraw`, {
      method: 'POST',
      headers: buildActorHeaders(),
      body: JSON.stringify({
        amount,
        note,
        performedByName: activeAuthSession?.name || activeAuthSession?.email || 'Administrator'
      })
    });
    setStatus(`Cash deduction recorded for ${drawerName || 'drawer'}: ${money(amount)}.`);
    await Promise.all([
      refreshCashDrawerAdmin(),
      refreshCashierMonitoring(),
      refreshShiftManagement()
    ]);
  } catch (error) {
    setStatus(`Cash drawer deduction failed: ${error.message}`);
  }
}

async function handleCashDrawerEditClick(drawerId, drawerName, initialBalance) {
  if (!canManageCashDrawer()) {
    setStatus('Only Administrations can edit drawers.');
    return;
  }
  if (!drawerId) return;

  const nextNameRaw = window.prompt('Edit drawer name:', drawerName || '');
  if (nextNameRaw === null) return;
  const nextName = String(nextNameRaw || '').trim();
  if (!nextName) {
    setStatus('Drawer name is required.');
    return;
  }

  const balancePrompt = window.prompt(`Edit the first amount for ${nextName}:`, String(Number(initialBalance || 0)));
  if (balancePrompt === null) return;
  const nextInitialBalance = parseNonNegativeAmount(balancePrompt);
  if (nextInitialBalance === null || nextInitialBalance <= 0) {
    setStatus('The first drawer amount must be greater than 0.');
    return;
  }

  try {
    await api(`/api/admin/drawers/${encodeURIComponent(drawerId)}`, {
      method: 'PUT',
      headers: buildActorHeaders(),
      body: JSON.stringify({
        name: nextName,
        initialBalance: nextInitialBalance
      })
    });
    setStatus(`Drawer "${nextName}" updated.`);
    await refreshCashDrawerAdmin();
  } catch (error) {
    setStatus(`Edit drawer failed: ${error.message}`);
  }
}

async function handleCashDrawerDeleteClick(drawerId, drawerName) {
  if (!canManageCashDrawer()) {
    setStatus('Only Administrations can delete drawers.');
    return;
  }
  if (!drawerId) return;

  const confirmed = window.confirm(`Delete drawer "${drawerName || 'Drawer'}"? This is only allowed before the drawer has any transactions or shift history.`);
  if (!confirmed) return;

  try {
    await api(`/api/admin/drawers/${encodeURIComponent(drawerId)}`, {
      method: 'DELETE',
      headers: buildActorHeaders()
    });
    setStatus(`Drawer "${drawerName || 'Drawer'}" deleted.`);
    await refreshCashDrawerAdmin();
  } catch (error) {
    setStatus(`Delete drawer failed: ${error.message}`);
  }
}

function renderShiftManagement(result) {
  const shifts = Array.isArray(result?.shifts) ? result.shifts : [];
  const summary = result?.summary || {};

  if (shiftManagementSummaryEl) {
    shiftManagementSummaryEl.innerHTML = `
      <div class="operations-metrics-grid">
        <article class="operations-metric-card highlight">
          <span>Shift Activity</span>
          <strong>${Number(summary.total || 0)}</strong>
          <small>Active ${Number(summary.active || 0)} | Logged Out ${Number(summary.loggedOut || 0)}</small>
        </article>
        <article class="operations-metric-card">
          <span>Review Queue</span>
          <strong>${Number(summary.pendingReview || 0)}</strong>
          <small>${Number(summary.discrepancyCount || 0)} shift(s) with discrepancy</small>
        </article>
        <article class="operations-metric-card">
          <span>Opening Adjustments</span>
          <strong>${money(summary.openingAdjustments || 0)}</strong>
          <small>Manual changes applied at shift start</small>
        </article>
        <article class="operations-metric-card">
          <span>On Hold for Void</span>
          <strong>${money(summary.holdForVoidAmount || 0)}</strong>
          <small>${Number(summary.holdForVoidCount || 0)} receipt(s) waiting for admin void review</small>
        </article>
        <article class="operations-metric-card">
          <span>Drawer Deductions</span>
          <strong>${money(summary.cashWithdrawals || 0)}</strong>
          <small>Recorded cash pull-outs in selected range</small>
        </article>
        <article class="operations-metric-card">
          <span>Cash Tendered</span>
          <strong>${money(summary.cashTendered || 0)}</strong>
          <small>Customer cash received before change</small>
        </article>
        <article class="operations-metric-card">
          <span>Change Given</span>
          <strong>${money(summary.changeGiven || 0)}</strong>
          <small>Cash returned to customers</small>
        </article>
        <article class="operations-metric-card highlight">
          <span>Net Cash</span>
          <strong>${money(summary.netCashRetained || 0)}</strong>
          <small>Cash retained after change and deductions</small>
        </article>
      </div>
    `;
  }

  if (!shiftManagementListEl) return;
  if (!shifts.length) {
    shiftManagementListEl.innerHTML = '<p>No operator shift records found.</p>';
    return;
  }

  const rows = shifts.map((row) => `
    <tr>
      <td><strong>${escapeHtml(row.cashierName || 'Operator')}</strong><br /><small>${escapeHtml(formatRoleLabel(row.cashierRole || 'encharge'))}</small></td>
      <td>${escapeHtml(row.drawerName || 'Drawer')}</td>
      <td>${escapeHtml(formatDate(row.shiftStartAt))}</td>
      <td>${escapeHtml(formatDate(row.shiftEndAt))}</td>
      <td>${row.previousDrawerBalance === null || row.previousDrawerBalance === undefined ? '—' : money(row.previousDrawerBalance)}</td>
      <td>${money(row.startingCash || 0)}</td>
      <td>${Number(row.openingAdjustment || 0) === 0 ? 'Verified' : formatDiscrepancyPill(row.openingAdjustment)}</td>
      <td>${money(row.expectedCash || 0)}</td>
      <td>${money(row.cashWithdrawals || 0)}</td>
      <td>${money(row.holdForVoidAmount || 0)}<br /><small>${Number(row.holdForVoidCount || 0)} receipt(s)</small></td>
      <td>${money(row.cashTendered || 0)}</td>
      <td>${money(row.changeGiven || 0)}</td>
      <td>${money(row.netCashRetained || 0)}</td>
      <td>${row.endingCash === null || row.endingCash === undefined ? '—' : money(row.endingCash)}</td>
      <td>${Number(row.discrepancy || 0) === 0 ? 'Balanced' : formatDiscrepancyPill(row.discrepancy)}</td>
      <td>${Number(row.discrepancy || 0) === 0 ? 'None' : formatReviewStatusPill(row.reviewStatus)}</td>
      <td>${formatReviewDetails(row)}</td>
      <td><span class="cashier-status-badge">${escapeHtml(String(row.status || '-').replace('_', ' '))}</span></td>
    </tr>
  `).join('');

  shiftManagementListEl.innerHTML = `
    <table class="admin-inline-table">
      <thead>
        <tr>
          <th>Operator</th>
          <th>Drawer</th>
          <th>Shift Start</th>
          <th>Shift End</th>
          <th>Previous Drawer</th>
          <th>Starting</th>
          <th>Opening Adjustment</th>
          <th>Expected</th>
          <th>Drawer Deductions</th>
          <th>Hold for Void</th>
          <th>Tendered</th>
          <th>Change</th>
          <th>Net Cash</th>
          <th>Actual</th>
          <th>Discrepancy</th>
          <th>Review</th>
          <th>Review Note</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

async function refreshShiftManagement() {
  if (!shiftManagementListEl || !canAccessOperationsPanel()) return;
  if (shiftManagementListEl) shiftManagementListEl.innerHTML = '<p>Loading shifts...</p>';
  if (shiftManagementSummaryEl) shiftManagementSummaryEl.textContent = 'Loading shift summary...';
  try {
    const params = getAdminRangeSearchParams();
    const query = params.toString();
    const result = await api(`/api/admin/shifts${query ? `?${query}` : ''}`, {
      headers: buildActorHeaders()
    });
    renderShiftManagement(result);
  } catch (error) {
    if (shiftManagementSummaryEl) shiftManagementSummaryEl.textContent = `Shift management error: ${error.message}`;
    if (shiftManagementListEl) shiftManagementListEl.innerHTML = '';
  }
}

function renderDiscrepancyAlerts(result) {
  const alerts = Array.isArray(result?.alerts) ? result.alerts : [];
  const summary = result?.summary || {};

  if (discrepancySummaryEl) {
    discrepancySummaryEl.innerHTML = `
      <div class="operations-metrics-grid compact">
        <article class="operations-metric-card highlight">
          <span>Total Alerts</span>
          <strong>${Number(summary.totalAlerts || 0)}</strong>
          <small>All discrepancy cases in selected range</small>
        </article>
        <article class="operations-metric-card">
          <span>Pending Review</span>
          <strong>${Number(summary.pendingReview || 0)}</strong>
          <small>Still waiting for manager action</small>
        </article>
        <article class="operations-metric-card">
          <span>Reviewed / Cleared</span>
          <strong>${Number(summary.approved || 0)}</strong>
          <small>Reviewed and closed with no further action</small>
        </article>
        <article class="operations-metric-card">
          <span>Under Investigation</span>
          <strong>${Number(summary.investigate || 0)}</strong>
          <small>Needs follow-up before closure</small>
        </article>
      </div>
    `;
  }

  if (!discrepancyAlertsListEl) return;
  if (!alerts.length) {
    discrepancyAlertsListEl.innerHTML = '<p>No discrepancies in the selected range.</p>';
    return;
  }

  const rows = alerts.map((row) => `
    <tr>
      <td><strong>${escapeHtml(row.cashierName || 'Cashier')}</strong></td>
      <td>${escapeHtml(row.drawerName || 'Drawer')}</td>
      <td>${escapeHtml(formatDate(row.shiftStartAt))}</td>
      <td>${money(row.expectedCash || 0)}</td>
      <td>${row.endingCash === null || row.endingCash === undefined ? '—' : money(row.endingCash)}</td>
      <td>${formatDiscrepancyPill(row.discrepancy)}</td>
      <td>${formatReviewStatusPill(row.reviewStatus)}</td>
      <td>${formatReviewDetails(row)}</td>
      <td>
        ${String(row.reviewStatus || '').toLowerCase() === 'approved'
          ? '<span class="review-action-text">Finalized</span>'
          : `
            <button class="secondary small" type="button" data-shift-review="${escapeHtml(row.shiftId)}" data-review-status="approved">Approve / Reconcile</button>
            <button class="secondary small" type="button" data-shift-review="${escapeHtml(row.shiftId)}" data-review-status="investigate">Investigate</button>
          `}
      </td>
    </tr>
  `).join('');

  discrepancyAlertsListEl.innerHTML = `
    <table class="admin-inline-table">
      <thead>
        <tr>
          <th>Cashier</th>
          <th>Drawer</th>
          <th>Shift Start</th>
          <th>Expected</th>
          <th>Ending</th>
          <th>Difference</th>
          <th>Review</th>
          <th>Review Note</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

async function refreshDiscrepancyAlerts() {
  if (!discrepancyAlertsListEl || !canAccessOperationsPanel()) return;
  if (discrepancySummaryEl) discrepancySummaryEl.textContent = 'Loading discrepancy alerts...';
  discrepancyAlertsListEl.innerHTML = '<p>Loading discrepancy alerts...</p>';
  try {
    const params = getAdminRangeSearchParams();
    const query = params.toString();
    const result = await api(`/api/admin/discrepancies${query ? `?${query}` : ''}`, {
      headers: buildActorHeaders()
    });
    renderDiscrepancyAlerts(result);
  } catch (error) {
    if (discrepancySummaryEl) discrepancySummaryEl.textContent = `Discrepancy alert error: ${error.message}`;
    if (discrepancyAlertsListEl) discrepancyAlertsListEl.innerHTML = '';
  }
}

function renderSalesOpsDashboard(result) {
  latestSalesOpsDashboard = result || null;
  const rows = Array.isArray(result?.hourlySales) ? result.hourlySales : [];
  const weekdayRows = Array.isArray(result?.weekdaySales) ? result.weekdaySales : [];
  const activeWeekdays = weekdayRows.filter((row) => Number(row?.totalSales || 0) > 0 || Number(row?.transactions || 0) > 0);

  renderSalesOpsSummaryCards(result);

  if (!hourlySalesGraphEl) return;

  const barChartMarkup = rows.length
    ? `
      <section class="sales-ops-panel">
        <div class="sales-ops-panel-head">
          <h3>Hourly Sales Bar Graph</h3>
          <div class="sales-ops-panel-actions">
            <span>${rows.filter((row) => Number(row?.totalSales || 0) > 0).length || 0} hour(s) with paid sales</span>
            <div class="sales-ops-view-toggle" role="group" aria-label="Hourly chart view">
              <button
                type="button"
                class="secondary small${activeSalesOpsHourlyView === 'bar' ? ' active' : ''}"
                data-sales-ops-hourly-view="bar"
              >Bar</button>
              <button
                type="button"
                class="secondary small${activeSalesOpsHourlyView === 'line' ? ' active' : ''}"
                data-sales-ops-hourly-view="line"
              >Trend Line</button>
              <button
                type="button"
                class="secondary small${activeSalesOpsHourlyView === 'both' ? ' active' : ''}"
                data-sales-ops-hourly-view="both"
              >Both</button>
            </div>
          </div>
        </div>
        <div class="sales-ops-weekday-chart-shell">
          <div class="sales-ops-weekday-canvas-wrap">
            <canvas id="salesOpsHourlyChart" aria-label="Hourly sales performance chart"></canvas>
          </div>
        </div>
        <div class="sales-ops-weekday-note">
          <strong>Reading guide:</strong>
          <span>Click a bar or point to focus the summary cards on that hour. Hovering still shows the guide line, sales amount, and transaction count.</span>
        </div>
      </section>
    `
    : `
      <section class="sales-ops-panel">
        <div class="sales-ops-panel-head">
          <h3>Hourly Sales Bar Graph</h3>
        </div>
        <p>No hourly sales data.</p>
      </section>
    `;

  const weekdayChartMarkup = weekdayRows.length
    ? `
      <section class="sales-ops-panel">
        <div class="sales-ops-panel-head">
          <h3>Weekday Sales Performance</h3>
          <div class="sales-ops-panel-actions">
            <span>${activeWeekdays.length || 0} day(s) with paid sales</span>
            <div class="sales-ops-view-toggle" role="group" aria-label="Weekday chart view">
              <button
                type="button"
                class="secondary small${activeSalesOpsWeekdayView === 'bar' ? ' active' : ''}"
                data-sales-ops-weekday-view="bar"
              >Bar</button>
              <button
                type="button"
                class="secondary small${activeSalesOpsWeekdayView === 'line' ? ' active' : ''}"
                data-sales-ops-weekday-view="line"
              >Trend Line</button>
              <button
                type="button"
                class="secondary small${activeSalesOpsWeekdayView === 'both' ? ' active' : ''}"
                data-sales-ops-weekday-view="both"
              >Both</button>
            </div>
          </div>
        </div>
        <div class="sales-ops-weekday-chart-shell">
          <div class="sales-ops-weekday-canvas-wrap">
            <canvas id="salesOpsWeekdayChart" aria-label="Weekday sales performance line chart"></canvas>
          </div>
        </div>
        <div class="sales-ops-weekday-note">
          <strong>Reading guide:</strong>
          <span>Click a bar or point to focus the summary cards on that day. Amounts stay on the left axis, with weekday and order counts below.</span>
        </div>
      </section>
    `
    : `
      <section class="sales-ops-panel">
        <div class="sales-ops-panel-head">
          <h3>Weekday Sales Performance</h3>
        </div>
        <p>No weekday sales data yet.</p>
      </section>
    `;

  hourlySalesGraphEl.innerHTML = `
    <div class="sales-ops-dashboard-grid single-chart">
      ${weekdayChartMarkup}
      ${barChartMarkup}
    </div>
  `;

  renderSalesOpsHourlyTrendChart(rows);
  renderSalesOpsWeekdayTrendChart(weekdayRows);
}

async function refreshSalesOpsDashboard(range = activeSalesOpsRange) {
  if (!salesOpsSummaryEl || !canAccessReportsPanel()) return;
  activeSalesOpsRange = normalizeSalesOpsRange(range);
  setActiveSalesOpsSelection(null);
  syncSalesOpsMonthPickerVisibility(activeSalesOpsRange);
  saveUserUiState({
    salesOpsRange: activeSalesOpsRange,
    salesOpsMonth: activeSalesOpsRange === 'custom_month' ? getSalesOpsSelectedMonth() : ''
  });
  if (salesOpsRangeEl && salesOpsRangeEl.value !== activeSalesOpsRange) {
    salesOpsRangeEl.value = activeSalesOpsRange;
  }
  if (salesOpsSummaryEl) salesOpsSummaryEl.textContent = 'Loading sales operations dashboard...';
  if (hourlySalesGraphEl) hourlySalesGraphEl.innerHTML = '<p>Loading hourly sales...</p>';
  try {
    const params = getSalesOpsRangeSearchParams();
    const query = params.toString();
    const result = await api(`/api/admin/sales/dashboard${query ? `?${query}` : ''}`, {
      headers: buildActorHeaders()
    });
    renderSalesOpsDashboard(result);
  } catch (error) {
    destroySalesOpsHourlyChart();
    destroySalesOpsWeekdayChart();
    if (salesOpsSummaryEl) salesOpsSummaryEl.textContent = `Sales operations error: ${error.message}`;
    if (hourlySalesGraphEl) hourlySalesGraphEl.innerHTML = '';
  }
}

function renderMonthlyClosing(result) {
  const monthValue = String(result?.month || getMonthlyClosingSelectedMonth()).trim();
  const summary = result?.summary || {};
  const expenses = Array.isArray(result?.expenses) ? result.expenses : [];
  const expenseByCategory = Array.isArray(result?.expenseByCategory) ? result.expenseByCategory : [];
  const topProducts = Array.isArray(result?.topProducts) ? result.topProducts : [];
  const canEdit = canManageMonthlyExpenses();
  const summaryCards = [
    {
      label: 'Gross Sales',
      value: money(summary.totalSales || 0),
      note: 'Total paid sales recorded for the selected month.',
      highlight: true
    },
    {
      label: 'Net After Expenses',
      value: money(summary.netSalesAfterExpenses || 0),
      note: 'Sales remaining after logged monthly expenses.',
      highlight: true
    },
    {
      label: 'Expenses',
      value: money(summary.totalExpenses || 0),
      note: `${Number(summary.expenseCount || 0).toLocaleString('en-PH')} expense entry/entries logged.`
    },
    {
      label: 'Cash Sales',
      value: money(summary.cashSales || 0),
      note: 'Transactions settled through cash payments.'
    },
    {
      label: 'E-Payments',
      value: money(summary.digitalSales || 0),
      note: 'GCash and PayMaya sales combined.'
    },
    {
      label: 'Drawer Withdrawals',
      value: money(summary.drawerWithdrawals || 0),
      note: 'Recorded cash deductions from drawer operations.'
    },
    {
      label: 'Shift Discrepancies',
      value: money(summary.totalDiscrepancy || 0),
      note: 'Combined overage or shortage across reviewed shifts.'
    },
    {
      label: 'Expense Entries',
      value: Number(summary.expenseCount || 0).toLocaleString('en-PH'),
      note: 'Monthly expense records included in this closing snapshot.'
    }
  ];

  if (monthlyClosingAdminNoteEl) {
    monthlyClosingAdminNoteEl.textContent = canEdit
      ? 'This role can log monthly operating expenses here.'
      : 'View-only mode. Current role can review the closing summary but cannot add expenses.';
  }

  if (monthlyExpenseFormEl) {
    Array.from(monthlyExpenseFormEl.elements || []).forEach((element) => {
      if (element instanceof HTMLInputElement || element instanceof HTMLButtonElement) {
        element.disabled = !canEdit;
      }
    });
  }

  if (monthlyClosingSummaryEl) {
    monthlyClosingSummaryEl.innerHTML = `
      <div class="monthly-closing-summary-head">
        <span class="monthly-closing-summary-eyebrow">Closing Snapshot</span>
        <h4>${escapeHtml(formatMonthLabel(monthValue))}</h4>
        <p>Sales, expenses, withdrawals, and discrepancies for the selected month.</p>
      </div>
      <div class="monthly-closing-summary-grid">
        ${summaryCards.map((card) => `
          <article class="monthly-closing-summary-card${card.highlight ? ' highlight' : ''}">
            <span>${escapeHtml(card.label)}</span>
            <strong>${escapeHtml(card.value)}</strong>
            <small>${escapeHtml(card.note)}</small>
          </article>
        `).join('')}
      </div>
    `;
  }

  if (!monthlyExpenseListEl) return;

  const categoryMarkup = expenseByCategory.length
    ? `
      <div class="monthly-closing-block">
        <div class="monthly-closing-block-head">
          <h3>Expense Categories</h3>
          <p>See where the month’s operating costs are concentrated.</p>
        </div>
        <div class="monthly-closing-table-wrap">
          <table class="admin-inline-table monthly-closing-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Entries</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${expenseByCategory.map((row) => `
                <tr>
                  <td>${escapeHtml(row.category || 'Uncategorized')}</td>
                  <td>${Number(row.count || 0)}</td>
                  <td>${money(row.totalAmount || 0)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `
    : `
      <div class="monthly-closing-block">
        <div class="monthly-closing-block-head">
          <h3>Expense Categories</h3>
          <p>See where the month’s operating costs are concentrated.</p>
        </div>
        <p class="monthly-closing-empty-state">No expenses logged for this month yet.</p>
      </div>
    `;

  const topProductsMarkup = topProducts.length
    ? `
      <div class="monthly-closing-block">
        <div class="monthly-closing-block-head">
          <h3>Top Products This Month</h3>
          <p>Quick sales snapshot of the strongest-selling products.</p>
        </div>
        <div class="monthly-closing-table-wrap">
          <table class="admin-inline-table monthly-closing-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty Sold</th>
                <th>Sales</th>
              </tr>
            </thead>
            <tbody>
              ${topProducts.slice(0, 5).map((row) => `
                <tr>
                  <td>${escapeHtml(row.productName || 'Product')}</td>
                  <td>${Number(row.qtySold || 0)}</td>
                  <td>${money(row.totalSales || 0)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `
    : `
      <div class="monthly-closing-block">
        <div class="monthly-closing-block-head">
          <h3>Top Products This Month</h3>
          <p>Quick sales snapshot of the strongest-selling products.</p>
        </div>
        <p class="monthly-closing-empty-state">No paid sales yet for this month.</p>
      </div>
    `;

  const expensesMarkup = expenses.length
    ? `
      <div class="monthly-closing-block full-width-block">
        <div class="monthly-closing-block-head">
          <h3>Expense Ledger</h3>
          <p>Every recorded monthly expense for the selected closing period.</p>
        </div>
        <div class="monthly-closing-table-wrap">
          <table class="admin-inline-table monthly-closing-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Note</th>
                <th>By</th>
              </tr>
            </thead>
            <tbody>
              ${expenses.map((row) => `
                <tr>
                  <td>${escapeHtml(formatDate(row.expenseDate))}</td>
                  <td>${escapeHtml(row.category || 'Uncategorized')}</td>
                  <td>${escapeHtml(row.description || '-')}</td>
                  <td>${money(row.amount || 0)}</td>
                  <td>${escapeHtml(row.note || '-')}</td>
                  <td>${escapeHtml(row.createdByName || row.createdByEmail || '-')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `
    : `
      <div class="monthly-closing-block full-width-block">
        <div class="monthly-closing-block-head">
          <h3>Expense Ledger</h3>
          <p>Every recorded monthly expense for the selected closing period.</p>
        </div>
        <p class="monthly-closing-empty-state">No expenses logged for this month.</p>
      </div>
    `;

  monthlyExpenseListEl.innerHTML = `
    <div class="monthly-closing-grid">
      ${categoryMarkup}
      ${topProductsMarkup}
      ${expensesMarkup}
    </div>
  `;
}

async function refreshMonthlyClosingModule() {
  if (!monthlyClosingSummaryEl || !canAccessMonthlyClosing()) return;
  const monthValue = getMonthlyClosingSelectedMonth();
  if (monthlyClosingMonthInputEl && !monthlyClosingMonthInputEl.value) {
    monthlyClosingMonthInputEl.value = monthValue;
  }
  if (monthlyClosingSummaryEl) monthlyClosingSummaryEl.innerHTML = '<p class="monthly-closing-loading">Loading monthly closing summary...</p>';
  if (monthlyExpenseListEl) monthlyExpenseListEl.innerHTML = '<p class="monthly-closing-loading">Loading monthly expenses...</p>';
  try {
    const result = await api(`/api/admin/monthly-closing?month=${encodeURIComponent(monthValue)}`, {
      headers: buildActorHeaders()
    });
    renderMonthlyClosing(result);
  } catch (error) {
    if (monthlyClosingSummaryEl) monthlyClosingSummaryEl.innerHTML = `<p class="monthly-closing-loading">Monthly closing error: ${escapeHtml(error.message)}</p>`;
    if (monthlyExpenseListEl) monthlyExpenseListEl.innerHTML = '';
  }
}

async function handleMonthlyExpenseSubmit(event) {
  event.preventDefault();
  if (!canManageMonthlyExpenses()) {
    setStatus('Current role does not have permission to add monthly expenses.');
    return;
  }

  const expenseDate = String(monthlyExpenseDateInputEl?.value || '').trim();
  const category = String(monthlyExpenseCategoryInputEl?.value || '').trim();
  const description = String(monthlyExpenseDescriptionInputEl?.value || '').trim();
  const amount = parseNonNegativeAmount(monthlyExpenseAmountInputEl?.value);
  const note = String(monthlyExpenseNoteInputEl?.value || '').trim();

  if (!expenseDate) {
    setStatus('Select the expense date.');
    return;
  }
  if (!category) {
    setStatus('Enter the expense category.');
    return;
  }
  if (!description) {
    setStatus('Enter the expense description.');
    return;
  }
  if (amount === null || amount <= 0) {
    setStatus('Enter an expense amount greater than 0.');
    return;
  }

  try {
    if (monthlyExpenseSaveBtnEl) {
      monthlyExpenseSaveBtnEl.disabled = true;
      monthlyExpenseSaveBtnEl.textContent = 'Saving...';
    }
    await api('/api/admin/expenses', {
      method: 'POST',
      headers: buildActorHeaders(),
      body: JSON.stringify({
        expenseDate,
        category,
        description,
        amount,
        note,
        createdByName: activeAuthSession?.name || activeAuthSession?.email || 'Administrator'
      })
    });
    if (monthlyExpenseCategoryInputEl) monthlyExpenseCategoryInputEl.value = '';
    if (monthlyExpenseDescriptionInputEl) monthlyExpenseDescriptionInputEl.value = '';
    if (monthlyExpenseAmountInputEl) monthlyExpenseAmountInputEl.value = '';
    if (monthlyExpenseNoteInputEl) monthlyExpenseNoteInputEl.value = '';
    setStatus(`Expense saved for ${formatMonthLabel(getMonthlyClosingSelectedMonth())}.`);
    await refreshMonthlyClosingModule();
  } catch (error) {
    setStatus(`Monthly expense save failed: ${error.message}`);
  } finally {
    if (monthlyExpenseSaveBtnEl) {
      monthlyExpenseSaveBtnEl.disabled = false;
      monthlyExpenseSaveBtnEl.textContent = 'Add Expense';
    }
  }
}

async function refreshAdminOperationsModules() {
  if (!canAccessOperationsPanel() && !canAccessCashDrawerControl() && !canAccessMonthlyClosing() && !canAccessReportsPanel()) return;
  await Promise.all([
    refreshCashierMonitoring(),
    refreshCashDrawerAdmin(),
    refreshShiftManagement(),
    refreshDiscrepancyAlerts(),
    refreshSalesOpsDashboard(activeSalesOpsRange),
    refreshMonthlyClosingModule()
  ]);
}

async function handleShiftReviewAction(shiftId, reviewStatus) {
  if (!shiftId || !reviewStatus) return;
  const actionLabel = String(reviewStatus).toLowerCase() === 'approved'
    ? 'Approve / Reconcile'
    : 'Investigate';
  const promptText = String(reviewStatus).toLowerCase() === 'approved'
    ? 'Enter the reconciliation note. Explain what caused the discrepancy and how it was resolved:'
    : 'Enter the investigation note. Explain the issue found or next action needed:';
  const rawNote = window.prompt(promptText, '');
  if (rawNote === null) return;
  const note = String(rawNote || '').trim();
  if (!note) {
    setStatus(`${actionLabel} requires a review note.`);
    return;
  }
  try {
    await api(`/api/admin/shifts/${encodeURIComponent(shiftId)}/review`, {
      method: 'PATCH',
      headers: buildActorHeaders(),
      body: JSON.stringify({ reviewStatus, reviewNote: note })
    });
    setStatus(`Discrepancy marked as ${actionLabel.toLowerCase()}.`);
    await refreshDiscrepancyAlerts();
    await refreshShiftManagement();
  } catch (error) {
    setStatus(`Discrepancy review failed: ${error.message}`);
  }
}

function setLatestAdminReport(report) {
  latestAdminReport = report || null;
  if (reportDownloadBtn) reportDownloadBtn.disabled = !latestAdminReport;
  if (reportPrintBtn) reportPrintBtn.disabled = !latestAdminReport;
}

const ADMIN_REPORT_DEFINITIONS = {
  'daily-sales': {
    title: 'Daily Sales Report',
    columns: [
      { key: 'reference', label: 'Reference' },
      { key: 'method', label: 'Method' },
      { key: 'amountPaid', label: 'Sale Amount' },
      { key: 'tenderedAmount', label: 'Tendered' },
      { key: 'changeAmount', label: 'Change' },
      { key: 'paidAt', label: 'Paid At' }
    ]
  },
  'monthly-closing': {
    title: 'Monthly Closing Report',
    columns: [
      { key: 'date', label: 'Date' },
      { key: 'category', label: 'Category' },
      { key: 'description', label: 'Description' },
      { key: 'amount', label: 'Amount' },
      { key: 'note', label: 'Note' },
      { key: 'createdAt', label: 'Created' }
    ]
  },
  'cashier-shift': {
    title: 'Cashier Shift Report',
    columns: [
      { key: 'cashierName', label: 'Cashier' },
      { key: 'drawerName', label: 'Drawer' },
      { key: 'shiftStartAt', label: 'Shift Start' },
      { key: 'shiftEndAt', label: 'Shift End' },
      { key: 'totalSales', label: 'Total Sales' },
      { key: 'totalTransactions', label: 'Transactions' },
      { key: 'netCashRetained', label: 'Net Cash' },
      { key: 'cashWithdrawals', label: 'Withdrawals' },
      { key: 'discrepancy', label: 'Discrepancy' }
    ]
  },
  transactions: {
    title: 'Transactions Report',
    columns: [
      { key: 'reference', label: 'Reference' },
      { key: 'status', label: 'Status' },
      { key: 'orderType', label: 'Order Type' },
      { key: 'paymentMethod', label: 'Payment Method', get: (row) => row?.payment?.method || row?.paymentMethod || '—' },
      { key: 'cashierName', label: 'Cashier' },
      { key: 'total', label: 'Total' },
      { key: 'paidAt', label: 'Paid At', get: (row) => row?.payment?.paidAt || row?.updatedAt || row?.createdAt },
      { key: 'createdAt', label: 'Created' }
    ]
  },
  'product-sales': {
    title: 'Product Sales Report',
    columns: [
      { key: 'productName', label: 'Product' },
      { key: 'qtySold', label: 'Qty Sold' },
      { key: 'totalSales', label: 'Total Sales' }
    ]
  },
  discrepancy: {
    title: 'Discrepancy Report',
    columns: [
      { key: 'cashierName', label: 'Cashier' },
      { key: 'drawerName', label: 'Drawer' },
      { key: 'shiftStartAt', label: 'Shift Start' },
      { key: 'shiftEndAt', label: 'Shift End' },
      { key: 'expectedCash', label: 'Expected Cash' },
      { key: 'endingCash', label: 'Ending Cash' },
      { key: 'discrepancy', label: 'Difference' },
      { key: 'reviewStatus', label: 'Review' },
      { key: 'reviewNote', label: 'Review Note' }
    ]
  }
};

function formatAdminReportFieldLabel(key) {
  return String(key || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase()) || 'Field';
}

function isAdminReportMoneyKey(key) {
  const normalized = String(key || '').trim().toLowerCase();
  if (!normalized) return false;
  if (/(transactions|shifts|products|discrepancies|count|qty|quantity)/i.test(normalized)) return false;
  return /(amount|sales|cash|change|value|price|expense|withdrawal|ticket|retained|balance)/i.test(normalized);
}

function isAdminReportDateKey(key) {
  return /(date|at|start|end|created|updated|paid)/i.test(String(key || ''));
}

function formatAdminReportNumber(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value ?? '—');
  if (Number.isInteger(n)) return n.toLocaleString('en-PH');
  return n.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatAdminReportValue(value, key = '') {
  if (value === null || value === undefined || value === '') return '—';
  if (key === 'discrepancy') return formatDiscrepancyAmount(value);
  if (typeof value === 'number') {
    return isAdminReportMoneyKey(key) ? money(value) : formatAdminReportNumber(value);
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (isAdminReportDateKey(key) && typeof value === 'string') return formatDate(value);
  if (Array.isArray(value)) return value.length ? value.map((item) => formatAdminReportValue(item)).join(', ') : '—';
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([childKey, childValue]) => `${formatAdminReportFieldLabel(childKey)}: ${formatAdminReportValue(childValue, childKey)}`)
      .join(' | ');
  }
  return String(value);
}

function getAdminReportDefinition(report) {
  return ADMIN_REPORT_DEFINITIONS[String(report?.reportType || '').trim().toLowerCase()] || null;
}

function getAdminReportRows(report) {
  return Array.isArray(report?.rows) ? report.rows : [];
}

function getAdminReportColumns(report) {
  const definition = getAdminReportDefinition(report);
  if (definition?.columns?.length) return definition.columns;
  const firstRow = getAdminReportRows(report)[0];
  return firstRow
    ? Object.keys(firstRow).map((key) => ({ key, label: formatAdminReportFieldLabel(key) }))
    : [];
}

function getAdminReportCellValue(row, column) {
  if (typeof column?.get === 'function') return column.get(row);
  return row?.[column?.key];
}

function flattenAdminReportSummary(summary, prefix = '') {
  return Object.entries(summary || {}).flatMap(([key, value]) => {
    const label = prefix ? `${prefix} ${formatAdminReportFieldLabel(key)}` : formatAdminReportFieldLabel(key);
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return flattenAdminReportSummary(value, label);
    }
    return [{ key, label, value }];
  });
}

function getAdminReportSummaryEntries(report) {
  return flattenAdminReportSummary(report?.summary || {});
}

function getAdminReportPeriodLabel(report) {
  if (String(report?.reportType || '') === 'monthly-closing' && report?.month) {
    return formatMonthLabel(report.month);
  }
  const rangeLabel = String(report?.range?.label || 'custom').trim().toUpperCase();
  const dateFrom = report?.range?.dateFrom ? formatDate(report.range.dateFrom) : '—';
  const dateTo = report?.range?.dateTo ? formatDate(report.range.dateTo) : '—';
  return `${rangeLabel} • ${dateFrom} to ${dateTo}`;
}

function buildAdminReportTableMarkup(title, rows, columns, emptyMessage = 'No rows available.') {
  const normalizedRows = Array.isArray(rows) ? rows : [];
  const normalizedColumns = Array.isArray(columns) ? columns : [];
  return `
    <section class="report-preview-table-card">
      <div class="report-preview-table-head">
        <h4>${escapeHtml(title)}</h4>
        <span>${normalizedRows.length} row(s)</span>
      </div>
      ${normalizedRows.length && normalizedColumns.length
        ? `
          <div class="report-preview-table-wrap">
            <table class="admin-inline-table report-preview-table">
              <thead>
                <tr>
                  ${normalizedColumns.map((column) => `<th>${escapeHtml(column.label || formatAdminReportFieldLabel(column.key))}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${normalizedRows.map((row) => `
                  <tr>
                    ${normalizedColumns.map((column) => `<td>${escapeHtml(formatAdminReportValue(getAdminReportCellValue(row, column), column.key || column.label || ''))}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `
        : `<p class="report-preview-empty">${escapeHtml(emptyMessage)}</p>`}
    </section>
  `;
}

function buildAdminReportExtraSections(report) {
  if (String(report?.reportType || '') !== 'monthly-closing') return '';
  const expenseByCategory = Array.isArray(report?.expenseByCategory) ? report.expenseByCategory : [];
  const topProducts = Array.isArray(report?.topProducts) ? report.topProducts : [];
  return [
    buildAdminReportTableMarkup(
      'Expense Categories',
      expenseByCategory,
      [
        { key: 'category', label: 'Category' },
        { key: 'count', label: 'Entries' },
        { key: 'totalAmount', label: 'Total Amount' }
      ],
      'No expense category breakdown available.'
    ),
    buildAdminReportTableMarkup(
      'Top Products Snapshot',
      topProducts,
      [
        { key: 'productName', label: 'Product' },
        { key: 'qtySold', label: 'Qty Sold' },
        { key: 'totalSales', label: 'Total Sales' }
      ],
      'No top product data available.'
    )
  ].join('');
}

function renderReportPreview(report) {
  if (!reportsPreviewEl) return;
  if (!report) {
    reportsPreviewEl.innerHTML = '<p>No report generated yet.</p>';
    return;
  }

  const definition = getAdminReportDefinition(report);
  const title = definition?.title || 'Admin Report';
  const summaryEntries = getAdminReportSummaryEntries(report);
  const rows = getAdminReportRows(report);
  const columns = getAdminReportColumns(report);

  reportsPreviewEl.innerHTML = `
    <div class="report-preview-shell">
      <div class="report-preview-header">
        <div class="report-preview-header-copy">
          <span class="report-preview-eyebrow">${escapeHtml(report.reportType || 'report')}</span>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(getAdminReportPeriodLabel(report))}</p>
        </div>
        <div class="report-preview-meta">
          <span>Generated</span>
          <strong>${escapeHtml(formatDate(report.generatedAt || new Date().toISOString()))}</strong>
        </div>
      </div>
      ${summaryEntries.length
        ? `
          <div class="report-preview-summary-grid">
            ${summaryEntries.map((entry) => `
              <article class="report-preview-summary-card">
                <span>${escapeHtml(entry.label)}</span>
                <strong>${escapeHtml(formatAdminReportValue(entry.value, entry.key))}</strong>
              </article>
            `).join('')}
          </div>
        `
        : ''}
      ${buildAdminReportTableMarkup('Main Rows', rows, columns, 'No rows found for this report.')}
      ${buildAdminReportExtraSections(report)}
    </div>
  `;
}

function escapeXml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function sanitizeWorksheetName(name) {
  return String(name || 'Report')
    .replace(/[\\/*?:[\]]/g, ' ')
    .trim()
    .slice(0, 31) || 'Report';
}

const ZIP_CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let j = 0; j < 8; j += 1) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = ZIP_CRC_TABLE[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8);
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function writeUint16LE(view, offset, value) {
  view.setUint16(offset, value & 0xFFFF, true);
}

function writeUint32LE(view, offset, value) {
  view.setUint32(offset, value >>> 0, true);
}

function getZipDosDateTime(date = new Date()) {
  const year = Math.max(1980, date.getFullYear());
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = Math.floor(date.getSeconds() / 2);
  return {
    time: (hours << 11) | (minutes << 5) | seconds,
    date: ((year - 1980) << 9) | (month << 5) | day
  };
}

function concatUint8Arrays(chunks) {
  const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;
  chunks.forEach((chunk) => {
    output.set(chunk, offset);
    offset += chunk.length;
  });
  return output;
}

function createZip(entries) {
  const encoder = new TextEncoder();
  const now = getZipDosDateTime(new Date());
  const localChunks = [];
  const centralChunks = [];
  let offset = 0;

  entries.forEach((entry) => {
    const nameBytes = encoder.encode(entry.name);
    const dataBytes = typeof entry.data === 'string' ? encoder.encode(entry.data) : entry.data;
    const crc = crc32(dataBytes);

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const localView = new DataView(localHeader.buffer);
    writeUint32LE(localView, 0, 0x04034b50);
    writeUint16LE(localView, 4, 20);
    writeUint16LE(localView, 6, 0);
    writeUint16LE(localView, 8, 0);
    writeUint16LE(localView, 10, now.time);
    writeUint16LE(localView, 12, now.date);
    writeUint32LE(localView, 14, crc);
    writeUint32LE(localView, 18, dataBytes.length);
    writeUint32LE(localView, 22, dataBytes.length);
    writeUint16LE(localView, 26, nameBytes.length);
    writeUint16LE(localView, 28, 0);
    localHeader.set(nameBytes, 30);
    localChunks.push(localHeader, dataBytes);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const centralView = new DataView(centralHeader.buffer);
    writeUint32LE(centralView, 0, 0x02014b50);
    writeUint16LE(centralView, 4, 20);
    writeUint16LE(centralView, 6, 20);
    writeUint16LE(centralView, 8, 0);
    writeUint16LE(centralView, 10, 0);
    writeUint16LE(centralView, 12, now.time);
    writeUint16LE(centralView, 14, now.date);
    writeUint32LE(centralView, 16, crc);
    writeUint32LE(centralView, 20, dataBytes.length);
    writeUint32LE(centralView, 24, dataBytes.length);
    writeUint16LE(centralView, 28, nameBytes.length);
    writeUint16LE(centralView, 30, 0);
    writeUint16LE(centralView, 32, 0);
    writeUint16LE(centralView, 34, 0);
    writeUint16LE(centralView, 36, 0);
    writeUint32LE(centralView, 38, 0);
    writeUint32LE(centralView, 42, offset);
    centralHeader.set(nameBytes, 46);
    centralChunks.push(centralHeader);

    offset += localHeader.length + dataBytes.length;
  });

  const centralDirectory = concatUint8Arrays(centralChunks);
  const endRecord = new Uint8Array(22);
  const endView = new DataView(endRecord.buffer);
  writeUint32LE(endView, 0, 0x06054b50);
  writeUint16LE(endView, 4, 0);
  writeUint16LE(endView, 6, 0);
  writeUint16LE(endView, 8, entries.length);
  writeUint16LE(endView, 10, entries.length);
  writeUint32LE(endView, 12, centralDirectory.length);
  writeUint32LE(endView, 16, offset);
  writeUint16LE(endView, 20, 0);

  return concatUint8Arrays([...localChunks, centralDirectory, endRecord]);
}

function getExcelColumnName(index) {
  let n = index + 1;
  let label = '';
  while (n > 0) {
    const remainder = (n - 1) % 26;
    label = String.fromCharCode(65 + remainder) + label;
    n = Math.floor((n - 1) / 26);
  }
  return label;
}

function buildXlsxInlineStringCell(ref, value, styleId = 0) {
  return `<c r="${ref}" t="inlineStr" s="${styleId}"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
}

function buildAdminReportExcelRows(report, maxColumns) {
  const definition = getAdminReportDefinition(report);
  const title = definition?.title || 'Admin Report';
  const summaryEntries = getAdminReportSummaryEntries(report);
  const mainColumns = getAdminReportColumns(report);
  const mainRows = getAdminReportRows(report);
  const extraSections = [];
  let mainTableHeaderRow = null;
  let mainTableLastRow = null;

  if (String(report?.reportType || '') === 'monthly-closing') {
    extraSections.push({
      title: 'Expense Categories',
      rows: Array.isArray(report?.expenseByCategory) ? report.expenseByCategory : [],
      columns: [
        { key: 'category', label: 'Category' },
        { key: 'count', label: 'Entries' },
        { key: 'totalAmount', label: 'Total Amount' }
      ]
    });
    extraSections.push({
      title: 'Top Products Snapshot',
      rows: Array.isArray(report?.topProducts) ? report.topProducts : [],
      columns: [
        { key: 'productName', label: 'Product' },
        { key: 'qtySold', label: 'Qty Sold' },
        { key: 'totalSales', label: 'Total Sales' }
      ]
    });
  }

  const rows = [
    {
      height: 28,
      cells: [{ value: title, styleId: 1, span: maxColumns }]
    },
    {
      cells: [
        { value: 'Report Type', styleId: 2 },
        { value: report.reportType || 'report', styleId: 3, span: Math.max(1, maxColumns - 1) }
      ]
    },
    {
      cells: [
        { value: 'Period', styleId: 2 },
        { value: getAdminReportPeriodLabel(report), styleId: 3, span: Math.max(1, maxColumns - 1) }
      ]
    },
    {
      cells: [
        { value: 'Generated', styleId: 2 },
        { value: formatDate(report.generatedAt || new Date().toISOString()), styleId: 3, span: Math.max(1, maxColumns - 1) }
      ]
    },
    { height: 8, cells: [] }
  ];

  if (summaryEntries.length) {
    rows.push({
      height: 22,
      cells: [{ value: 'Summary', styleId: 5, span: maxColumns }]
    });
    summaryEntries.forEach((entry) => {
      rows.push({
        cells: [
          { value: entry.label, styleId: 2 },
          { value: formatAdminReportValue(entry.value, entry.key), styleId: 3, span: Math.max(1, maxColumns - 1) }
        ]
      });
    });
    rows.push({ height: 8, cells: [] });
  }

  const pushSection = (sectionTitle, sectionRows, sectionColumns, options = {}) => {
    rows.push({
      height: 22,
      cells: [{ value: sectionTitle, styleId: 5, span: maxColumns }]
    });
    if (!sectionRows.length || !sectionColumns.length) {
      rows.push({
        cells: [{ value: 'No rows available.', styleId: 6, span: maxColumns }]
      });
      rows.push({ height: 8, cells: [] });
      return;
    }
    const headerRowNumber = rows.length + 1;
    rows.push({
      height: 22,
      cells: sectionColumns.map((column) => ({
        value: column.label || formatAdminReportFieldLabel(column.key),
        styleId: 4
      }))
    });
    if (options.trackMainTable) {
      mainTableHeaderRow = headerRowNumber;
      mainTableLastRow = headerRowNumber;
    }
    sectionRows.forEach((row) => {
      const dataRowNumber = rows.length + 1;
      rows.push({
        cells: sectionColumns.map((column) => ({
          value: formatAdminReportValue(getAdminReportCellValue(row, column), column.key || column.label || ''),
          styleId: dataRowNumber % 2 === 0 ? 0 : 7
        }))
      });
      if (options.trackMainTable) {
        mainTableLastRow = dataRowNumber;
      }
    });
    rows.push({ height: 8, cells: [] });
  };

  pushSection('Main Rows', mainRows, mainColumns, { trackMainTable: true });
  extraSections.forEach((section) => pushSection(section.title, section.rows, section.columns));

  return {
    rows,
    mainTableHeaderRow,
    mainTableLastRow
  };
}

function buildAdminReportExcelWorkbook(report) {
  const definition = getAdminReportDefinition(report);
  const title = definition?.title || 'Admin Report';
  const worksheetName = sanitizeWorksheetName(title);
  const mainColumns = getAdminReportColumns(report);
  const extraColumnCounts = String(report?.reportType || '') === 'monthly-closing'
    ? [3, 3]
    : [];
  const maxColumns = Math.max(2, mainColumns.length || 0, ...extraColumnCounts);
  const {
    rows,
    mainTableHeaderRow,
    mainTableLastRow
  } = buildAdminReportExcelRows(report, maxColumns);
  const mergeRanges = [];
  const worksheetRowsXml = rows.map((row, rowIndex) => {
    const rowNumber = rowIndex + 1;
    if (!row.cells.length) return `<row r="${rowNumber}"${row.height ? ` ht="${row.height}" customHeight="1"` : ''}/>`;
    let columnIndex = 0;
    const cellsXml = row.cells.map((cell) => {
      const ref = `${getExcelColumnName(columnIndex)}${rowNumber}`;
      const span = Math.max(1, Number(cell.span || 1));
      const startColumn = columnIndex;
      columnIndex += span;
      if (span > 1) {
        mergeRanges.push(`${getExcelColumnName(startColumn)}${rowNumber}:${getExcelColumnName(columnIndex - 1)}${rowNumber}`);
      }
      return buildXlsxInlineStringCell(ref, cell.value, cell.styleId || 0);
    }).join('');
    return `<row r="${rowNumber}"${row.height ? ` ht="${row.height}" customHeight="1"` : ''}>${cellsXml}</row>`;
  }).join('');
  const lastColumn = getExcelColumnName(maxColumns - 1);
  const lastRow = rows.length || 1;
  const generatedIso = new Date().toISOString();
  const freezePaneXml = mainTableHeaderRow
    ? `
    <sheetViews>
      <sheetView workbookViewId="0">
        <pane ySplit="${Math.max(0, mainTableHeaderRow - 1)}" topLeftCell="A${mainTableHeaderRow}" activePane="bottomLeft" state="frozen"/>
        <selection pane="bottomLeft" activeCell="A${mainTableHeaderRow}" sqref="A${mainTableHeaderRow}"/>
      </sheetView>
    </sheetViews>`
    : `
    <sheetViews>
      <sheetView workbookViewId="0"/>
    </sheetViews>`;
  const autoFilterXml = mainTableHeaderRow && mainTableLastRow && mainTableLastRow >= mainTableHeaderRow
    ? `<autoFilter ref="A${mainTableHeaderRow}:${lastColumn}${mainTableLastRow}"/>`
    : '';
  const mergeCellsXml = mergeRanges.length
    ? `
  <mergeCells count="${mergeRanges.length}">
    ${mergeRanges.map((range) => `<mergeCell ref="${range}"/>`).join('')}
  </mergeCells>`
    : '';

  const files = [
    {
      name: '[Content_Types].xml',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
  <Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>
  <Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>
</Types>`
    },
    {
      name: '_rels/.rels',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>
</Relationships>`
    },
    {
      name: 'docProps/app.xml',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">
  <Application>POS System</Application>
  <DocSecurity>0</DocSecurity>
  <ScaleCrop>false</ScaleCrop>
  <HeadingPairs>
    <vt:vector size="2" baseType="variant">
      <vt:variant><vt:lpstr>Worksheets</vt:lpstr></vt:variant>
      <vt:variant><vt:i4>1</vt:i4></vt:variant>
    </vt:vector>
  </HeadingPairs>
  <TitlesOfParts>
    <vt:vector size="1" baseType="lpstr">
      <vt:lpstr>${escapeXml(worksheetName)}</vt:lpstr>
    </vt:vector>
  </TitlesOfParts>
  <Company>POS System</Company>
  <LinksUpToDate>false</LinksUpToDate>
  <SharedDoc>false</SharedDoc>
  <HyperlinksChanged>false</HyperlinksChanged>
  <AppVersion>16.0300</AppVersion>
</Properties>`
    },
    {
      name: 'docProps/core.xml',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title>${escapeXml(title)}</dc:title>
  <dc:creator>POS System</dc:creator>
  <cp:lastModifiedBy>POS System</cp:lastModifiedBy>
  <dcterms:created xsi:type="dcterms:W3CDTF">${escapeXml(generatedIso)}</dcterms:created>
  <dcterms:modified xsi:type="dcterms:W3CDTF">${escapeXml(generatedIso)}</dcterms:modified>
</cp:coreProperties>`
    },
    {
      name: 'xl/workbook.xml',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets>
    <sheet name="${escapeXml(worksheetName)}" sheetId="1" r:id="rId1"/>
  </sheets>
</workbook>`
    },
    {
      name: 'xl/_rels/workbook.xml.rels',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`
    },
    {
      name: 'xl/styles.xml',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="5">
    <font><sz val="11"/><name val="Calibri"/></font>
    <font><b/><sz val="18"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><name val="Calibri"/></font>
    <font><i/><sz val="11"/><color rgb="FF6B4C39"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
  </fonts>
  <fills count="6">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF5E6D8"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FF5A3521"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFF8F1"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFDF2E6"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFD8C1AE"/></left>
      <right style="thin"><color rgb="FFD8C1AE"/></right>
      <top style="thin"><color rgb="FFD8C1AE"/></top>
      <bottom style="thin"><color rgb="FFD8C1AE"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="8">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="1" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="4" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="3" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="center" wrapText="1"/></xf>
    <xf numFmtId="0" fontId="0" fillId="5" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf>
  </cellXfs>
  <cellStyles count="1">
    <cellStyle name="Normal" xfId="0" builtinId="0"/>
  </cellStyles>
</styleSheet>`
    },
    {
      name: 'xl/worksheets/sheet1.xml',
      data: `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <dimension ref="A1:${lastColumn}${lastRow}"/>
  ${freezePaneXml}
  <sheetFormatPr defaultRowHeight="15"/>
  <cols>
    ${Array.from({ length: maxColumns }, (_, index) => {
      const width = index === 0 ? 26 : index === 1 ? 34 : 20;
      return `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`;
    }).join('')}
  </cols>
  <sheetData>
    ${worksheetRowsXml}
  </sheetData>
  ${autoFilterXml}
  ${mergeCellsXml}
</worksheet>`
    }
  ];

  return createZip(files);
}

async function generateAdminReport(reportType, label, extraParams = null) {
  if (!canAccessReportsPanel()) return;
  if (reportsStatusEl) reportsStatusEl.textContent = `Generating ${label} report...`;

  try {
    const params = extraParams instanceof URLSearchParams
      ? new URLSearchParams(extraParams.toString())
      : getAdminRangeSearchParams();
    const query = params.toString();
    const report = await api(`/api/admin/reports/${encodeURIComponent(reportType)}${query ? `?${query}` : ''}`, {
      headers: buildActorHeaders()
    });
    setLatestAdminReport(report);
    renderReportPreview(report);
    if (reportsStatusEl) {
      reportsStatusEl.textContent = `${label} report generated. You can now download the Excel file or print it.`;
    }
  } catch (error) {
    setLatestAdminReport(null);
    if (reportsStatusEl) reportsStatusEl.textContent = `${label} report error: ${error.message}`;
    if (reportsPreviewEl) reportsPreviewEl.innerHTML = '';
  }
}

function downloadLatestAdminReport() {
  if (!latestAdminReport) return;
  const workbookXlsx = buildAdminReportExcelWorkbook(latestAdminReport);
  const blob = new Blob([workbookXlsx], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  anchor.href = url;
  anchor.download = `${latestAdminReport.reportType || 'admin-report'}-${stamp}.xlsx`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function printLatestAdminReport() {
  if (!latestAdminReport) return;
  const printWindow = window.open('', '_blank', 'width=980,height=860');
  if (!printWindow) {
    if (reportsStatusEl) reportsStatusEl.textContent = 'Print blocked by the browser. Allow pop-ups and try again.';
    return;
  }
  if (reportsStatusEl) reportsStatusEl.textContent = 'Opening print preview...';
  printWindow.document.open();
  printWindow.document.write(buildAdminReportExportDocument(latestAdminReport, { excelMode: false, printMode: true }));
  printWindow.document.close();
}

function buildAdminReportExportDocument(report, { excelMode = false, printMode = false } = {}) {
  const definition = getAdminReportDefinition(report);
  const title = definition?.title || 'Admin Report';
  const summaryEntries = getAdminReportSummaryEntries(report);
  const rows = getAdminReportRows(report);
  const columns = getAdminReportColumns(report);
  const workbookTitle = escapeHtml(title);
  const summaryMarkup = summaryEntries.length
    ? `
      <div class="sheet-summary-grid">
        ${summaryEntries.map((entry) => `
          <div class="sheet-summary-card">
            <span>${escapeHtml(entry.label)}</span>
            <strong>${escapeHtml(formatAdminReportValue(entry.value, entry.key))}</strong>
          </div>
        `).join('')}
      </div>
    `
    : '';

  const mainTableMarkup = buildAdminReportTableMarkup('Main Rows', rows, columns, 'No rows found for this report.');
  const extraSectionsMarkup = buildAdminReportExtraSections(report);

  return `
    <html ${excelMode ? 'xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"' : ''}>
      <head>
        <meta charset="utf-8" />
        <title>${workbookTitle}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #2b1a10;
            padding: 20px;
            margin: 0;
            background: #ffffff;
          }
          .sheet-toolbar {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-bottom: 16px;
          }
          .sheet-toolbar button {
            border: 1px solid #d8c1ae;
            border-radius: 10px;
            background: #fff8f1;
            color: #4a2d1d;
            padding: 8px 14px;
            font-size: 13px;
            font-weight: 700;
            cursor: pointer;
          }
          .sheet-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 16px;
            margin-bottom: 16px;
          }
          .sheet-eyebrow {
            display: block;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: #8a5b3d;
            margin-bottom: 6px;
          }
          .sheet-header h1 {
            margin: 0 0 4px;
            font-size: 24px;
            color: #4a2d1d;
          }
          .sheet-header p,
          .sheet-meta {
            margin: 0;
            font-size: 12px;
            line-height: 1.5;
            color: #6b4c39;
          }
          .sheet-summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 10px;
            margin-bottom: 16px;
          }
          .sheet-summary-card {
            border: 1px solid #d8c1ae;
            border-radius: 10px;
            padding: 10px 12px;
            background: #fffaf5;
          }
          .sheet-summary-card span {
            display: block;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: #8a5b3d;
            margin-bottom: 6px;
          }
          .sheet-summary-card strong {
            font-size: 16px;
            color: #4a2d1d;
          }
          .report-preview-table-card {
            margin-bottom: 16px;
          }
          .report-preview-table-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
          }
          .report-preview-table-head h4 {
            margin: 0;
            font-size: 16px;
            color: #4a2d1d;
          }
          .report-preview-table-head span,
          .report-preview-empty {
            font-size: 12px;
            color: #6b4c39;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th,
          td {
            border: 1px solid #d8c1ae;
            padding: 8px 10px;
            font-size: 12px;
            text-align: left;
            vertical-align: top;
          }
          th {
            background: #f5e6d8;
            color: #4a2d1d;
            font-weight: 700;
          }
          td {
            background: #ffffff;
          }
          @page {
            margin: 0.45in;
          }
          @media print {
            body {
              padding: 0;
            }
            .no-print {
              display: none !important;
            }
          }
        </style>
        ${printMode
          ? `
            <script>
              window.addEventListener('load', function () {
                window.setTimeout(function () {
                  window.focus();
                  window.print();
                }, 250);
              });
              window.addEventListener('afterprint', function () {
                window.close();
              });
            </script>
          `
          : ''}
      </head>
      <body>
        ${printMode
          ? `
            <div class="sheet-toolbar no-print">
              <button type="button" onclick="window.print()">Print</button>
              <button type="button" onclick="window.close()">Close</button>
            </div>
          `
          : ''}
        <div class="sheet-header">
          <div>
            <span class="sheet-eyebrow">${escapeHtml(report.reportType || 'report')}</span>
            <h1>${workbookTitle}</h1>
            <p>${escapeHtml(getAdminReportPeriodLabel(report))}</p>
          </div>
          <p class="sheet-meta">Generated: ${escapeHtml(formatDate(report.generatedAt || new Date().toISOString()))}</p>
        </div>
        ${summaryMarkup}
        ${mainTableMarkup}
        ${extraSectionsMarkup}
      </body>
    </html>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function updateInvoiceStatus(invoiceId, nextStatus) {
  const normalizedStatus = String(nextStatus || '').trim().toUpperCase();
  const actionLabel = normalizedStatus === 'VOIDED'
    ? 'void'
    : normalizedStatus === 'HOLD_FOR_VOID'
      ? 'hold for void'
      : 'cancel';
  const promptLabel = normalizedStatus === 'VOIDED'
    ? 'Enter the reason for voiding this paid invoice:'
    : normalizedStatus === 'HOLD_FOR_VOID'
      ? 'Enter the note for admin review before this receipt is voided:'
    : 'Enter the reason for cancelling this pending invoice:';
  const reason = String(window.prompt(promptLabel, '') || '').trim();
  if (!reason) {
    setStatus(`A reason is required to ${actionLabel} the invoice.`);
    return;
  }

  try {
    await api(`/api/admin/invoices/${encodeURIComponent(invoiceId)}/status`, {
      method: 'PATCH',
      headers: buildActorHeaders(),
      body: JSON.stringify({
        status: normalizedStatus,
        reason
      })
    });
    setStatus(`Invoice ${actionLabel}ed successfully.`);
    await refreshSalesReport(activeSalesRange);
    await Promise.all([
      refreshAdminTransactions(),
      refreshCashierMonitoring(),
      refreshShiftManagement()
    ]);
    try {
      const summary = await refreshLatestShiftSummary();
      if (shiftMonitorModalEl?.classList.contains('open') && summary) {
        renderShiftSummary(shiftMonitorSummaryEl, summary);
      }
    } catch (_error) {
      // Keep the lifecycle update successful even if the shift monitor refresh fails.
    }
  } catch (error) {
    setStatus(`Invoice ${actionLabel} failed: ${error.message}`);
  }
}

async function cancelActivePendingInvoice(reason, successMessage = 'Pending invoice cancelled.') {
  const activeInvoiceId = String(state.activeInvoice?.id || state.scanQrContext?.invoiceId || '').trim();
  const activeStatus = String(state.activeInvoice?.status || '').trim().toUpperCase();
  if (!activeInvoiceId || activeStatus !== 'PENDING') {
    resetAfterSale();
    return false;
  }
  let cancelled = false;

  try {
    const { invoice } = await api(`/api/admin/invoices/${encodeURIComponent(activeInvoiceId)}/status`, {
      method: 'PATCH',
      headers: buildActorHeaders(),
      body: JSON.stringify({
        status: 'CANCELLED',
        reason
      })
    });
    state.activeInvoice = invoice || null;
    cancelled = true;
    setStatus(successMessage);
    if (canAccessAdminFeatures()) {
      await refreshSalesReport(activeSalesRange);
    }
  } catch (error) {
    setStatus(`Pending invoice cancellation failed: ${error.message}`);
  } finally {
    if (cancelled) {
      resetAfterSale();
    }
  }

  return cancelled;
}

async function verifyPayment(invoiceId) {
  try {
    const btn = document.querySelector(`[data-verify="${invoiceId}"]`);
    if (btn) {
      btn.textContent = 'Verifying...';
      btn.disabled = true;
    }

    const result = await api(`/api/payments/ewallet/verify/${invoiceId}`, {
      method: 'POST'
    });

    if (result.verified || result.alreadyPaid) {
      const reference = String(result?.invoice?.reference || invoiceId);
      setStatus(`Payment verified. Invoice ${reference} is now PAID.`);
      showConfirmationToast({
        title: 'Payment verified',
        message: `Invoice ${reference} is now marked as paid.`,
        tone: 'success'
      });
    } else {
      const sessionStatus = String(result?.sessionStatus || 'unknown').toUpperCase();
      const message = String(result?.message || 'Payment is still pending.');
      setStatus(`Payment still pending. Status: ${sessionStatus}. ${message}`);
      showConfirmationToast({
        title: 'Payment still pending',
        message: `Status: ${sessionStatus}. ${message}`,
        tone: 'warning',
        duration: 3200
      });
    }

    await refreshAdminTransactions();
    await refreshSalesReport(activeSalesRange);
  } catch (error) {
    setStatus(`Verification failed: ${error.message}`);
    showConfirmationToast({
      title: 'Verification failed',
      message: error.message,
      tone: 'warning',
      duration: 3200
    });
    await refreshAdminTransactions();
  }
}

async function verifyAllPending() {
  try {
    adminVerifyAllBtn.textContent = 'Verifying...';
    adminVerifyAllBtn.disabled = true;

    const range = adminRangeEl.value;

    let url = '/api/admin/transactions?status=PENDING&';
    if (range) url += `range=${encodeURIComponent(range)}&`;

    const { transactions } = await api(url, {
      headers: buildActorHeaders()
    });
    const gcashPending = transactions.filter((t) => t.paymentMethod !== 'cash');

    if (!gcashPending.length) {
      setStatus('No pending E-Payment transactions to verify.');
      showConfirmationToast({
        title: 'Nothing to verify',
        message: 'There are no pending e-payment transactions in the selected range.',
        tone: 'warning',
        duration: 2600
      });
      adminVerifyAllBtn.textContent = 'Verify All Pending';
      adminVerifyAllBtn.disabled = false;
      return;
    }

    let verified = 0;
    let failed = 0;

    for (const t of gcashPending) {
      try {
        const result = await api(`/api/payments/ewallet/verify/${t.id}`, { method: 'POST' });
        if (result.verified || result.alreadyPaid) {
          verified++;
        }
      } catch (err) {
        failed++;
      }
    }

    const stillPending = gcashPending.length - verified - failed;
    setStatus(`Verification complete. Verified: ${verified}, Still pending: ${stillPending}, Errors: ${failed}.`);
    showConfirmationToast({
      title: failed > 0 ? 'Verification completed with warnings' : 'Verification completed',
      message: `Verified: ${verified}, Still pending: ${stillPending}, Errors: ${failed}`,
      tone: failed > 0 ? 'warning' : 'success',
      duration: 3600
    });

    await refreshAdminTransactions();
    await refreshSalesReport(activeSalesRange);
  } catch (error) {
    setStatus(`Verification error: ${error.message}`);
    showConfirmationToast({
      title: 'Verification error',
      message: error.message,
      tone: 'warning',
      duration: 3200
    });
  } finally {
    adminVerifyAllBtn.textContent = 'Verify All Pending';
    adminVerifyAllBtn.disabled = false;
  }
}

async function viewReceipt(invoiceId) {
  try {
    const { invoice } = await api(`/api/invoices/${invoiceId}`);
    if (!invoice) {
      setStatus('Receipt not found.');
      showConfirmationToast({
        title: 'Receipt not found',
        message: 'The selected receipt could not be loaded.',
        tone: 'warning',
        duration: 2600
      });
      return;
    }
    renderAdminReceiptModal(invoice);
    openAdminReceiptModal();
  } catch (error) {
    setStatus(`Unable to load receipt: ${error.message}`);
    showConfirmationToast({
      title: 'Receipt load failed',
      message: error.message,
      tone: 'warning',
      duration: 3200
    });
  }
}

// ------------------------------------------
// Event Listeners & Init
// ------------------------------------------

function setupEventListeners() {
  // Tab navigation
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
  });

  if (categoryButtonsEl) {
    categoryButtonsEl.addEventListener('click', (e) => {
      const category = e.target.closest('.category-btn')?.getAttribute('data-category');
      if (category) switchCategory(category);
    });
  }

  // POS events
  productsEl.addEventListener('click', onProductClick);
  cartEl.addEventListener('click', onProductClick);
  paymentMethodEl.addEventListener('change', onPaymentMethodChange);
  if (dineInCheckoutBtn) {
    dineInCheckoutBtn.addEventListener('click', async () => {
      if (!await requireCashierShiftForTransactions('Start your shift before selecting an order type.')) return;
      setOrderType('dine-in');
    });
  }
  if (takeOutCheckoutBtn) {
    takeOutCheckoutBtn.addEventListener('click', async () => {
      if (!await requireCashierShiftForTransactions('Start your shift before selecting an order type.')) return;
      setOrderType('take-out');
    });
  }
  if (cashPaymentBtn) {
    cashPaymentBtn.addEventListener('click', async () => {
      if (!await requireCashierShiftForTransactions('Start your shift before taking a cash payment.')) return;
      if (!state.orderType) {
        setStatus('Select order type first: Dine In or Take Out.');
        return;
      }
      state.cashPromptActive = true;
      setPaymentMethod('cash');
      setStatus('Enter cash tendered amount, then click Pay.');
      if (amountTenderedEl) amountTenderedEl.focus();
    });
  }
  if (cashPayBtn) {
    cashPayBtn.addEventListener('click', async () => {
      if (!await requireCashierShiftForTransactions('Start your shift before processing a cash payment.')) return;
      if (!state.orderType) {
        setStatus('Select order type first: Dine In or Take Out.');
        return;
      }
      if (!amountTenderedEl?.value) {
        setStatus('Enter customer cash tendered amount.');
        if (amountTenderedEl) amountTenderedEl.focus();
        return;
      }
      setPaymentMethod('cash');
      await handleCheckout();
    });
  }
  if (ePaymentBtn) {
    ePaymentBtn.addEventListener('click', async () => {
      if (!await requireCashierShiftForTransactions('Start your shift before processing an e-payment.')) return;
      if (!state.orderType) {
        setStatus('Select order type first: Dine In or Take Out.');
        return;
      }
      if (!isEwalletAvailable()) {
        setStatus('Offline mode active. E-Payment is temporarily unavailable.');
        return;
      }
      if (!getCartItems().length) {
        setStatus('Add at least one item first.');
        return;
      }
      openEwalletModal();
    });
  }
  if (chooseGcashBtn) {
    chooseGcashBtn.addEventListener('click', async () => {
      if (!await requireCashierShiftForTransactions('Start your shift before processing a GCash payment.')) return;
      if (!isEwalletAvailable()) {
        setStatus('Offline mode active. GCash checkout is unavailable.');
        return;
      }
      closeEwalletModal();
      setPaymentMethod('gcash');
      await handleCheckout();
    });
  }
  if (choosePaymayaBtn) {
    choosePaymayaBtn.addEventListener('click', async () => {
      if (!await requireCashierShiftForTransactions('Start your shift before processing a PayMaya payment.')) return;
      if (!isEwalletAvailable()) {
        setStatus('Offline mode active. PayMaya checkout is unavailable.');
        return;
      }
      closeEwalletModal();
      setPaymentMethod('paymaya');
      await handleCheckout();
    });
  }
  if (chooseScanQrBtn) {
    chooseScanQrBtn.addEventListener('click', async () => {
      if (!await requireCashierShiftForTransactions('Start your shift before processing a QR payment.')) return;
      if (!isEwalletAvailable()) {
        setStatus('Offline mode active. QR checkout is unavailable.');
        return;
      }
      closeEwalletModal();
      setPaymentMethod('gcash');
      await startScanQrPaymentFlow();
    });
  }
  if (cancelEwalletBtn) {
    cancelEwalletBtn.addEventListener('click', closeEwalletModal);
  }
  if (scanQrFinishBtn) {
    scanQrFinishBtn.addEventListener('click', finishScanQrPayment);
  }
  if (scanQrCancelBtn) {
    scanQrCancelBtn.addEventListener('click', async () => {
      if (String(state.activeInvoice?.status || '').trim().toUpperCase() === 'PENDING') {
        await cancelActivePendingInvoice(
          'Customer cancelled the QR checkout before payment was completed.',
          'QR checkout cancelled.'
        );
        return;
      }
      closeScanQrModal();
    });
  }
  if (discountProfileSelectEl) {
    discountProfileSelectEl.addEventListener('change', () => {
      state.selectedDiscountProfileId = String(discountProfileSelectEl.value || '').trim();
      renderCart();
    });
  }
  clearBtn.addEventListener('click', async () => {
    if (String(state.activeInvoice?.status || '').trim().toUpperCase() === 'PENDING') {
      await cancelActivePendingInvoice(
        'Customer cancelled the checkout before payment was completed.',
        'Pending invoice cancelled and cart cleared.'
      );
      return;
    }
    resetAfterSale();
    setStatus('Cleared. Ready.');
  });
  if (salesDailyBtn) {
    salesDailyBtn.addEventListener('click', () => refreshSalesReport('daily', { refreshSalesOps: false }));
  }
  if (salesWeeklyBtn) {
    salesWeeklyBtn.addEventListener('click', () => refreshSalesReport('weekly', { refreshSalesOps: false }));
  }
  if (salesRefreshBtn) {
    salesRefreshBtn.addEventListener('click', () => refreshSalesReport(activeSalesRange, { refreshSalesOps: false }));
  }

  // Admin events
  setupAdminNavButtons();
  if (receiptTemplateFormEl) {
    receiptTemplateFormEl.addEventListener('input', () => {
      renderReceiptTemplatePreview();
      updateReceiptTemplateEditorState();
    });
    receiptTemplateFormEl.addEventListener('change', () => {
      renderReceiptTemplatePreview();
      updateReceiptTemplateEditorState();
    });
  }
  if (receiptTemplatePreviewAreaEl) {
    receiptTemplatePreviewAreaEl.addEventListener('mousedown', startReceiptTemplatePreviewDrag);
  }
  window.addEventListener('mousemove', continueReceiptTemplatePreviewDrag);
  window.addEventListener('mouseup', stopReceiptTemplatePreviewDrag);
  if (receiptTemplateLogoUrlInputEl) {
    receiptTemplateLogoUrlInputEl.addEventListener('input', () => {
      const key = state.receiptTemplateEditorId || RECEIPT_TEMPLATE_LOCAL_DRAFT_KEY;
      if (getStoredReceiptTemplateLogo(key)) {
        setStoredReceiptTemplateLogo(key, '');
        if (receiptTemplateLogoFileInputEl) receiptTemplateLogoFileInputEl.value = '';
      }
      renderReceiptTemplatePreview();
      updateReceiptTemplateEditorState();
    });
  }
  if (receiptTemplateLogoFileInputEl) {
    receiptTemplateLogoFileInputEl.addEventListener('change', async () => {
      if (!canManageReceiptTemplates()) {
        setStatus('Current role does not have permission to upload a local receipt logo.');
        if (receiptTemplateLogoFileInputEl) receiptTemplateLogoFileInputEl.value = '';
        return;
      }
      try {
        const dataUrl = await readFileAsDataUrl(receiptTemplateLogoFileInputEl);
        if (!dataUrl) return;
        setStoredReceiptTemplateLogo(state.receiptTemplateEditorId || RECEIPT_TEMPLATE_LOCAL_DRAFT_KEY, dataUrl);
        renderReceiptTemplatePreview();
        updateReceiptTemplateEditorState();
        setStatus('Receipt logo uploaded to this browser for the selected template.');
      } catch (error) {
        setStatus(`Receipt logo upload failed: ${error.message}`);
      }
    });
  }
  if (receiptTemplateLogoClearBtnEl) {
    receiptTemplateLogoClearBtnEl.addEventListener('click', () => {
      if (!canManageReceiptTemplates()) {
        setStatus('Current role does not have permission to clear a local receipt logo.');
        return;
      }
      setStoredReceiptTemplateLogo(state.receiptTemplateEditorId || RECEIPT_TEMPLATE_LOCAL_DRAFT_KEY, '');
      if (receiptTemplateLogoFileInputEl) receiptTemplateLogoFileInputEl.value = '';
      renderReceiptTemplatePreview();
      updateReceiptTemplateEditorState();
      setStatus('Local receipt logo removed for this template.');
    });
  }
  if (receiptTemplateResetBtnEl) {
    receiptTemplateResetBtnEl.addEventListener('click', () => {
      populateReceiptTemplateEditor(getActiveReceiptTemplate());
      setStatus('Receipt template editor reset to the active template.');
    });
  }
  if (receiptTemplateSaveNewBtnEl) {
    receiptTemplateSaveNewBtnEl.addEventListener('click', async () => {
      if (!canManageReceiptTemplates()) {
        setStatus('Current role does not have permission to save order slip templates.');
        return;
      }
      const draft = collectReceiptTemplateDraft();
      if (!draft.name) {
        setStatus('Enter an order slip template name first.');
        receiptTemplateNameInputEl?.focus();
        return;
      }
      const sourceLogoKey = state.receiptTemplateEditorId || RECEIPT_TEMPLATE_LOCAL_DRAFT_KEY;
      try {
        const result = await api('/api/admin/receipt-templates', {
          method: 'POST',
          headers: buildActorHeaders(),
          body: JSON.stringify({
            name: draft.name,
            settings: draft.settings
          })
        });
        moveStoredReceiptTemplateLogo(sourceLogoKey, result?.template?.id || draft.id);
        await refreshReceiptTemplatesModule();
        populateReceiptTemplateEditor(result?.template || draft);
        setStatus(`Receipt template "${draft.name}" saved.`);
      } catch (error) {
        setStatus(`Receipt template save failed: ${error.message}`);
      }
    });
  }
  if (receiptTemplateUpdateBtnEl) {
    receiptTemplateUpdateBtnEl.addEventListener('click', async () => {
      if (!canManageReceiptTemplates()) {
        setStatus('Current role does not have permission to update order slip templates.');
        return;
      }
      const draft = collectReceiptTemplateDraft();
      if (!state.receiptTemplateEditorId) {
        setStatus('Load a saved template before updating it.');
        return;
      }
      try {
        const result = await api(`/api/admin/receipt-templates/${encodeURIComponent(state.receiptTemplateEditorId)}`, {
          method: 'PUT',
          headers: buildActorHeaders(),
          body: JSON.stringify({
            name: draft.name,
            settings: draft.settings
          })
        });
        await refreshReceiptTemplatesModule();
        populateReceiptTemplateEditor(result?.template || draft);
        setStatus(`Receipt template "${draft.name}" updated.`);
      } catch (error) {
        setStatus(`Receipt template update failed: ${error.message}`);
      }
    });
  }
  if (receiptTemplateActivateBtnEl) {
    receiptTemplateActivateBtnEl.addEventListener('click', async () => {
      if (!canManageReceiptTemplates()) {
        setStatus('Current role does not have permission to activate order slip templates.');
        setReceiptTemplatesStatus('Current role does not have permission to activate order slip templates.', 'error');
        return;
      }
      const selectedId = state.receiptTemplateEditorId;
      if (!selectedId) {
        setStatus('Load a saved template before activating it.');
        setReceiptTemplatesStatus('Load a saved template before activating it.', 'error');
        return;
      }
      try {
        const result = await api(`/api/admin/receipt-templates/${encodeURIComponent(selectedId)}/activate`, {
          method: 'PUT',
          headers: buildActorHeaders()
        });
        const activatedTemplate = normalizeReceiptTemplate(result?.template || state.receiptTemplates.find((template) => template.id === selectedId));
        state.receiptTemplateEditorId = activatedTemplate.id || selectedId;
        applyReceiptTemplatesState({
          templates: state.receiptTemplates.map((template) => ({
            ...template,
            isActive: template.id === selectedId
          })),
          activeReceiptTemplate: activatedTemplate,
          statusMessage: `Success: order slip template "${activatedTemplate.name || 'Selected'}" is now active for transaction printing.`,
          statusTone: 'success'
        });
        setStatus(`Receipt template "${activatedTemplate.name || 'selected'}" is now active for transaction printing.`);
        showConfirmationToast({
          title: 'Order Slip Template Active',
          message: `${activatedTemplate.name || 'Selected template'} is now used for transaction order slips.`
        });
      } catch (error) {
        setReceiptTemplatesStatus(`Receipt template activation failed: ${error.message}`, 'error');
        setStatus(`Receipt template activation failed: ${error.message}`);
      }
    });
  }
  if (receiptTemplateListEl) {
    receiptTemplateListEl.addEventListener('click', async (event) => {
      const loadBtn = event.target.closest('[data-receipt-template-load]');
      if (loadBtn) {
        const templateId = String(loadBtn.getAttribute('data-receipt-template-load') || '').trim();
        const template = state.receiptTemplates.find((row) => row.id === templateId);
        if (template) {
          populateReceiptTemplateEditor(template);
          setStatus(`Loaded order slip template "${template.name}".`);
        }
        return;
      }

      const activateBtn = event.target.closest('[data-receipt-template-activate]');
      if (activateBtn) {
        if (!canManageReceiptTemplates()) {
          setStatus('Current role does not have permission to activate order slip templates.');
          setReceiptTemplatesStatus('Current role does not have permission to activate order slip templates.', 'error');
          return;
        }
        const templateId = String(activateBtn.getAttribute('data-receipt-template-activate') || '').trim();
        if (!templateId) return;
        try {
          const result = await api(`/api/admin/receipt-templates/${encodeURIComponent(templateId)}/activate`, {
            method: 'PUT',
            headers: buildActorHeaders()
          });
          const activatedTemplate = normalizeReceiptTemplate(result?.template || state.receiptTemplates.find((template) => template.id === templateId));
          state.receiptTemplateEditorId = activatedTemplate.id || templateId;
          applyReceiptTemplatesState({
            templates: state.receiptTemplates.map((template) => ({
              ...template,
              isActive: template.id === templateId
            })),
            activeReceiptTemplate: activatedTemplate,
            statusMessage: `Success: order slip template "${activatedTemplate.name || 'Selected'}" is now active for transaction printing.`,
            statusTone: 'success'
          });
          setStatus(`Receipt template "${activatedTemplate.name || 'selected'}" is now active for transaction printing.`);
          showConfirmationToast({
            title: 'Order Slip Template Active',
            message: `${activatedTemplate.name || 'Selected template'} is now used for transaction order slips.`
          });
        } catch (error) {
          setReceiptTemplatesStatus(`Receipt template activation failed: ${error.message}`, 'error');
          setStatus(`Receipt template activation failed: ${error.message}`);
        }
        return;
      }

      const deleteBtn = event.target.closest('[data-receipt-template-delete]');
      if (!deleteBtn) return;
      if (!canManageReceiptTemplates()) {
        setStatus('Current role does not have permission to delete order slip templates.');
        return;
      }
      const templateId = String(deleteBtn.getAttribute('data-receipt-template-delete') || '').trim();
      const template = state.receiptTemplates.find((row) => row.id === templateId);
      if (!templateId || !template) return;
      const confirmed = window.confirm(`Delete order slip template "${template.name}"?`);
      if (!confirmed) return;
      try {
        await api(`/api/admin/receipt-templates/${encodeURIComponent(templateId)}`, {
          method: 'DELETE',
          headers: buildActorHeaders()
        });
        setStoredReceiptTemplateLogo(templateId, '');
        if (state.receiptTemplateEditorId === templateId) {
          state.receiptTemplateEditorId = null;
        }
        await refreshReceiptTemplatesModule();
        setStatus(`Receipt template "${template.name}" deleted.`);
      } catch (error) {
        setStatus(`Receipt template delete failed: ${error.message}`);
      }
    });
  }
  if (inventoryIngredientFormEl) {
    inventoryIngredientFormEl.addEventListener('submit', handleIngredientSubmit);
  }
  if (inventoryBulkToggleBtnEl) {
    inventoryBulkToggleBtnEl.addEventListener('click', () => {
      toggleInventoryBulkEditor();
    });
  }
  if (inventoryBulkEditorEl) {
    inventoryBulkEditorEl.addEventListener('submit', (event) => {
      if (event.target?.id !== 'inventoryBulkEditForm') return;
      handleInventoryBulkEditSubmit(event).catch((error) => {
        const bulkStatusEl = inventoryBulkEditorEl.querySelector('#inventoryBulkStatus');
        if (bulkStatusEl) bulkStatusEl.textContent = `Bulk update failed: ${error.message}`;
      });
    });
    inventoryBulkEditorEl.addEventListener('click', (event) => {
      const resetBtn = event.target.closest('#inventoryBulkResetBtn');
      if (!resetBtn) return;
      resetInventoryBulkEditorInputs();
    });
  }
  if (inventoryTableWrapEl) {
    inventoryTableWrapEl.addEventListener('click', (e) => {
      const historyBtn = e.target.closest('[data-inventory-history]');
      if (historyBtn) {
        handleInventoryHistoryClick(historyBtn);
        return;
      }
      const editBtn = e.target.closest('[data-inventory-edit]');
      if (editBtn) {
        handleInventoryEditClick(editBtn);
        return;
      }
      const deleteBtn = e.target.closest('[data-inventory-delete]');
      if (deleteBtn) {
        handleInventoryDeleteClick(deleteBtn);
      }
    });
  }
  if (inventorySummaryEl) {
    inventorySummaryEl.addEventListener('click', (e) => {
      const insightCard = e.target.closest('[data-inventory-view]');
      if (!insightCard || !latestInventoryReportData) return;
      const nextView = String(insightCard.getAttribute('data-inventory-view') || 'ingredients').trim() || 'ingredients';
      activeInventoryView = nextView;
      renderInventoryReport(latestInventoryReportData);
    });
    inventorySummaryEl.addEventListener('keydown', (e) => {
      const insightCard = e.target.closest('[data-inventory-view]');
      if (!insightCard || !latestInventoryReportData) return;
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      const nextView = String(insightCard.getAttribute('data-inventory-view') || 'ingredients').trim() || 'ingredients';
      activeInventoryView = nextView;
      renderInventoryReport(latestInventoryReportData);
    });
  }
  if (inventoryAlertsWrapEl) {
    inventoryAlertsWrapEl.addEventListener('click', (e) => {
      const closeBtn = e.target.closest('[data-inventory-view]');
      if (!closeBtn || !latestInventoryReportData) return;
      activeInventoryView = String(closeBtn.getAttribute('data-inventory-view') || 'ingredients').trim() || 'ingredients';
      renderInventoryReport(latestInventoryReportData);
    });
  }
  if (inventoryEditCloseBtnEl) {
    inventoryEditCloseBtnEl.addEventListener('click', closeInventoryEditModal);
  }
  if (inventoryEditFormEl) {
    inventoryEditFormEl.addEventListener('submit', (event) => {
      handleInventoryEditSubmit(event).catch((error) => {
        if (inventoryEditStatusEl) inventoryEditStatusEl.textContent = `Update ingredient failed: ${error.message}`;
      });
    });
  }
  if (inventoryDeleteCloseBtnEl) {
    inventoryDeleteCloseBtnEl.addEventListener('click', closeInventoryDeleteModal);
  }
  if (inventoryDeleteConfirmBtnEl) {
    inventoryDeleteConfirmBtnEl.addEventListener('click', () => {
      submitInventoryDelete().catch((error) => {
        if (inventoryDeleteStatusEl) inventoryDeleteStatusEl.textContent = `Delete ingredient failed: ${error.message}`;
      });
    });
  }
  if (inventoryHistoryCloseBtnEl) {
    inventoryHistoryCloseBtnEl.addEventListener('click', closeInventoryHistoryModal);
  }
  if (kitSpecCategorySelectEl) {
    kitSpecCategorySelectEl.addEventListener('change', () => {
      renderKitSpecProductOptions();
      renderKitSpecEditor();
      renderKitSpecCoverage();
    });
  }
  if (kitSpecProductSelectEl) {
    kitSpecProductSelectEl.addEventListener('change', () => {
      loadKitSpecDraftRowsForSelectedProduct();
      renderKitSpecEditor();
    });
  }
  if (kitSpecAddRowBtnEl) {
    kitSpecAddRowBtnEl.addEventListener('click', addKitSpecDraftRow);
  }
  if (kitSpecSaveBtnEl) {
    kitSpecSaveBtnEl.addEventListener('click', () => {
      saveKitSpecForSelectedProduct().catch((error) => {
        setStatus(`Save kit specification failed: ${error.message}`);
      });
    });
  }
  if (kitSpecModeToggleBtnEl) {
    kitSpecModeToggleBtnEl.addEventListener('click', () => {
      handleKitSpecModeToggle().catch((error) => {
        setStatus(`Kit Spec mode update failed: ${error.message}`);
      });
    });
  }
  if (kitSpecSummaryEl) {
    kitSpecSummaryEl.addEventListener('click', (e) => {
      const filterBtn = e.target.closest('[data-kit-spec-filter]');
      if (!filterBtn) return;
      kitSpecCoverageFilter = String(filterBtn.getAttribute('data-kit-spec-filter') || 'all-products').trim() || 'all-products';
      renderKitSpecCoverage();
    });
  }
  if (kitSpecEditorEl) {
    kitSpecEditorEl.addEventListener('change', (e) => {
      const fieldEl = e.target.closest('[data-kit-spec-field]');
      if (!fieldEl) return;
      handleKitSpecEditorFieldChange(fieldEl);
    });
    kitSpecEditorEl.addEventListener('click', (e) => {
      const removeBtn = e.target.closest('[data-kit-spec-remove]');
      if (!removeBtn) return;
      updateKitSpecDraftFromEditor();
      const index = Number(removeBtn.getAttribute('data-kit-spec-remove'));
      if (!Number.isInteger(index) || index < 0) return;
      kitSpecDraftRows.splice(index, 1);
      if (!kitSpecDraftRows.length) {
        kitSpecDraftRows = [{ ingredientId: '', qtyPerProduct: '' }];
      }
      renderKitSpecEditor();
    });
  }
  if (adminCreateUserFormEl) {
    adminCreateUserFormEl.addEventListener('submit', handleAdminCreateUserSubmit);
  }
  if (adminUsersListEl) {
    adminUsersListEl.addEventListener('click', handleAdminUsersAction);
  }
  if (roleAccessListEl) {
    roleAccessListEl.addEventListener('click', (event) => {
      handleRoleAccessManagerClick(event).catch((error) => {
        setStatus(`Role access update failed: ${error.message}`);
      });
    });
    roleAccessListEl.addEventListener('submit', (event) => {
      handleRoleAccessManagerSubmit(event).catch((error) => {
        setStatus(`Role access update failed: ${error.message}`);
      });
    });
  }
  adminRefreshBtn.addEventListener('click', () => {
    const selectedRange = String(adminRangeEl?.value || '').trim().toLowerCase();
    refreshSalesReport(selectedRange, { refreshSalesOps: false });
  });
  adminVerifyAllBtn.addEventListener('click', verifyAllPending);
  if (adminMixToggleBtn) {
    adminMixToggleBtn.addEventListener('click', () => {
      setAdminMixPanelVisibility(!isAdminMixPanelOpen);
    });
  }
  adminFilterEl.addEventListener('change', () => {
    refreshAdminTransactions();
  });
  adminRangeEl.addEventListener('change', () => {
    const selectedRange = String(adminRangeEl?.value || '').trim().toLowerCase();
    if (selectedRange === 'custom_month' && adminMonthPickerEl) {
      adminMonthPickerEl.style.display = 'inline-block';
      if (!adminMonthPickerEl.value) {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        adminMonthPickerEl.value = `${y}-${m}`;
      }
    } else if (adminMonthPickerEl) {
      adminMonthPickerEl.style.display = 'none';
    }
    refreshSalesReport(selectedRange, { refreshSalesOps: false });
  });
  if (adminMonthPickerEl) {
    adminMonthPickerEl.addEventListener('change', () => {
      refreshSalesReport('custom_month', { refreshSalesOps: false });
    });
  }
  if (salesOpsRefreshBtn) {
    salesOpsRefreshBtn.addEventListener('click', () => refreshSalesOpsDashboard(getSalesOpsRangeQueryValue()));
  }
  if (salesOpsRangeEl) {
    salesOpsRangeEl.addEventListener('change', () => {
      syncSalesOpsMonthPickerVisibility(getSalesOpsRangeQueryValue());
      refreshSalesOpsDashboard(getSalesOpsRangeQueryValue());
    });
  }
  if (salesOpsMonthPickerEl) {
    salesOpsMonthPickerEl.addEventListener('change', () => {
      refreshSalesOpsDashboard('custom_month');
    });
  }
  if (hourlySalesGraphEl) {
    hourlySalesGraphEl.addEventListener('click', (event) => {
      const hourlyToggleBtn = event.target.closest('[data-sales-ops-hourly-view]');
      if (hourlyToggleBtn && latestSalesOpsDashboard) {
        const nextView = normalizeSalesOpsHourlyView(hourlyToggleBtn.getAttribute('data-sales-ops-hourly-view'));
        if (nextView !== activeSalesOpsHourlyView) {
          activeSalesOpsHourlyView = nextView;
          saveUserUiState({ salesOpsHourlyView: activeSalesOpsHourlyView });
          renderSalesOpsDashboard(latestSalesOpsDashboard);
        }
        return;
      }
      const toggleBtn = event.target.closest('[data-sales-ops-weekday-view]');
      if (!toggleBtn || !latestSalesOpsDashboard) return;
      const nextView = normalizeSalesOpsWeekdayView(toggleBtn.getAttribute('data-sales-ops-weekday-view'));
      if (nextView === activeSalesOpsWeekdayView) return;
      activeSalesOpsWeekdayView = nextView;
      saveUserUiState({ salesOpsWeekdayView: activeSalesOpsWeekdayView });
      renderSalesOpsDashboard(latestSalesOpsDashboard);
    });
  }
  if (cashierMonitoringRefreshBtn) {
    cashierMonitoringRefreshBtn.addEventListener('click', refreshCashierMonitoring);
  }
  if (cashDrawerCreateFormEl) {
    cashDrawerCreateFormEl.addEventListener('submit', handleCashDrawerCreate);
  }
  if (cashDrawerInitialBalanceInputEl) {
    cashDrawerInitialBalanceInputEl.addEventListener('input', syncCashDrawerInitialBalanceValidity);
    cashDrawerInitialBalanceInputEl.addEventListener('invalid', () => {
      syncCashDrawerInitialBalanceValidity();
    });
  }
  if (cashDrawerListEl) {
    cashDrawerListEl.addEventListener('click', (e) => {
      const withdrawBtn = e.target.closest('[data-drawer-withdraw]');
      if (withdrawBtn) {
        const drawerId = String(withdrawBtn.getAttribute('data-drawer-withdraw') || '').trim();
        const drawerName = String(withdrawBtn.getAttribute('data-drawer-name') || '').trim() || 'Drawer';
        handleCashDrawerWithdrawClick(drawerId, drawerName);
        return;
      }

      const editBtn = e.target.closest('[data-drawer-edit]');
      if (editBtn) {
        const drawerId = String(editBtn.getAttribute('data-drawer-edit') || '').trim();
        const drawerName = String(editBtn.getAttribute('data-drawer-name') || '').trim() || 'Drawer';
        const initialBalance = Number(editBtn.getAttribute('data-drawer-initial-balance') || 0);
        handleCashDrawerEditClick(drawerId, drawerName, initialBalance);
        return;
      }

      const deleteBtn = e.target.closest('[data-drawer-delete]');
      if (deleteBtn) {
        const drawerId = String(deleteBtn.getAttribute('data-drawer-delete') || '').trim();
        const drawerName = String(deleteBtn.getAttribute('data-drawer-name') || '').trim() || 'Drawer';
        handleCashDrawerDeleteClick(drawerId, drawerName);
      }
    });
  }
  if (shiftManagementRefreshBtn) {
    shiftManagementRefreshBtn.addEventListener('click', refreshShiftManagement);
  }
  if (discrepancyRefreshBtn) {
    discrepancyRefreshBtn.addEventListener('click', refreshDiscrepancyAlerts);
  }
  if (discrepancyAlertsListEl) {
    discrepancyAlertsListEl.addEventListener('click', (e) => {
      const reviewBtn = e.target.closest('[data-shift-review]');
      if (!reviewBtn) return;
      const shiftId = String(reviewBtn.getAttribute('data-shift-review') || '').trim();
      const reviewStatus = String(reviewBtn.getAttribute('data-review-status') || '').trim().toLowerCase();
      handleShiftReviewAction(shiftId, reviewStatus);
    });
  }
  if (reportDailySalesBtn) {
    reportDailySalesBtn.addEventListener('click', () => generateAdminReport('daily-sales', 'Daily Sales'));
  }
  if (reportMonthlyClosingBtn) {
    reportMonthlyClosingBtn.addEventListener('click', () => {
      const params = new URLSearchParams();
      params.set('month', getMonthlyClosingSelectedMonth());
      generateAdminReport('monthly-closing', 'Monthly Closing', params);
    });
  }
  if (reportShiftBtn) {
    reportShiftBtn.addEventListener('click', () => generateAdminReport('cashier-shift', 'Cashier Shift'));
  }
  if (reportTransactionsBtn) {
    reportTransactionsBtn.addEventListener('click', () => generateAdminReport('transactions', 'Transactions'));
  }
  if (reportProductsBtn) {
    reportProductsBtn.addEventListener('click', () => generateAdminReport('product-sales', 'Product Sales'));
  }
  if (reportDiscrepancyBtn) {
    reportDiscrepancyBtn.addEventListener('click', () => generateAdminReport('discrepancy', 'Discrepancy'));
  }
  if (reportDownloadBtn) {
    reportDownloadBtn.addEventListener('click', downloadLatestAdminReport);
  }
  if (reportPrintBtn) {
    reportPrintBtn.addEventListener('click', printLatestAdminReport);
  }
  if (monthlyClosingRefreshBtnEl) {
    monthlyClosingRefreshBtnEl.addEventListener('click', refreshMonthlyClosingModule);
  }
  if (monthlyExpenseFormEl) {
    monthlyExpenseFormEl.addEventListener('submit', (event) => {
      handleMonthlyExpenseSubmit(event).catch((error) => {
        setStatus(`Monthly expense save failed: ${error.message}`);
      });
    });
  }
  if (discountProfileFormEl) {
    discountProfileFormEl.addEventListener('submit', (event) => {
      handleDiscountProfileSubmit(event).catch((error) => {
        setStatus(`Discount type save failed: ${error.message}`);
      });
    });
  }
  if (discountProfilesListEl) {
    discountProfilesListEl.addEventListener('click', (event) => {
      handleDiscountProfileListClick(event).catch((error) => {
        setStatus(`Discount type update failed: ${error.message}`);
      });
    });
    discountProfilesListEl.addEventListener('keydown', handleDiscountProfileListKeydown);
  }
  if (discountProfileModalCloseBtnEl) {
    discountProfileModalCloseBtnEl.addEventListener('click', closeDiscountProfileModal);
  }
  if (discountProfileModalEl) {
    discountProfileModalEl.addEventListener('click', (event) => {
      if (event.target === discountProfileModalEl) {
        closeDiscountProfileModal();
      }
    });
  }
  if (discountProfileModalTypeInputEl) {
    discountProfileModalTypeInputEl.addEventListener('change', updateDiscountProfileModalAmountField);
  }
  if (discountProfileModalFormEl) {
    discountProfileModalFormEl.addEventListener('submit', (event) => {
      handleDiscountProfileModalSubmit(event).catch((error) => {
        setStatus(`Discount type update failed: ${error.message}`);
      });
    });
  }
  if (discountProfileModalDeleteBtnEl) {
    discountProfileModalDeleteBtnEl.addEventListener('click', () => {
      handleDiscountProfileModalDelete().catch((error) => {
        setStatus(`Discount type delete failed: ${error.message}`);
      });
    });
  }
  if (salesListEl) {
    salesListEl.addEventListener('click', (e) => {
      const receiptId = e.target.closest('[data-receipt]')?.getAttribute('data-receipt');
      if (receiptId) {
        viewReceipt(receiptId);
      }
    });
  }

  // Delegate verify button clicks in admin transactions list
  adminTransactionsEl.addEventListener('click', (e) => {
    const verifyId = e.target.closest('[data-verify]')?.getAttribute('data-verify');
    if (verifyId) {
      verifyPayment(verifyId);
      return;
    }
    const statusBtn = e.target.closest('[data-invoice-status]');
    if (statusBtn) {
      const invoiceId = String(statusBtn.getAttribute('data-invoice-status') || '').trim();
      const nextStatus = String(statusBtn.getAttribute('data-next-status') || '').trim();
      if (invoiceId && nextStatus) {
        updateInvoiceStatus(invoiceId, nextStatus);
      }
      return;
    }
    const receiptId = e.target.closest('[data-receipt]')?.getAttribute('data-receipt');
    if (receiptId) {
      viewReceipt(receiptId);
    }
  });

  if (adminCloseBtn) {
    adminCloseBtn.addEventListener('click', closeAdminDashboard);
  }

  if (paymentSuccessDoneBtn) {
    paymentSuccessDoneBtn.addEventListener('click', closePaymentSuccessModal);
  }
  if (receiptMinimizeBtn) {
    receiptMinimizeBtn.addEventListener('click', togglePaymentReceiptCollapse);
  }
  if (receiptPrintBtn) {
    receiptPrintBtn.addEventListener('click', printReceiptFromModal);
  }
  if (statusHoldForVoidBtn) {
    statusHoldForVoidBtn.addEventListener('click', () => {
      requestHoldForVoid().catch((error) => {
        setStatus(`Hold for void failed: ${error.message}`);
      });
    });
  }
  if (receiptHoldForVoidBtn) {
    receiptHoldForVoidBtn.addEventListener('click', () => {
      requestHoldForVoid().catch((error) => {
        setStatus(`Hold for void failed: ${error.message}`);
      });
    });
  }
  if (statusPrintReceiptBtn) {
    statusPrintReceiptBtn.addEventListener('click', openLatestReceiptPreview);
  }
  if (adminReceiptPrintBtn) {
    adminReceiptPrintBtn.addEventListener('click', printAdminReceiptFromModal);
  }
  if (adminReceiptCloseBtn) {
    adminReceiptCloseBtn.addEventListener('click', closeAdminReceiptModal);
  }
  if (menuEditorCloseBtn) {
    menuEditorCloseBtn.addEventListener('click', closeMenuEditor);
  }
  if (menuCategoryFormEl) {
    menuCategoryFormEl.addEventListener('submit', handleMenuCategorySubmit);
  }
  if (menuProductFormEl) {
    menuProductFormEl.addEventListener('submit', handleMenuProductSubmit);
  }
  if (menuCategoryEditorListEl) {
    menuCategoryEditorListEl.addEventListener('click', handleMenuCategoryEditorClick);
  }
  if (menuProductEditorListEl) {
    menuProductEditorListEl.addEventListener('click', handleMenuProductEditorClick);
  }
  if (shiftMonitorToggleBtn) {
    shiftMonitorToggleBtn.addEventListener('click', async () => {
      if (!activeAuthSession?.email) return;
      openShiftMonitorModal();
      await showShiftMonitorSummary();
    });
  }
  if (shiftMonitorCloseBtn) {
    shiftMonitorCloseBtn.addEventListener('click', closeShiftMonitorModal);
  }
  if (shiftMonitorRefreshBtn) {
    shiftMonitorRefreshBtn.addEventListener('click', async () => {
      await showShiftMonitorSummary();
    });
  }
  if (cashoutCancelBtn) {
    cashoutCancelBtn.addEventListener('click', closeCashoutSummaryModal);
  }
  if (cashoutSaveReportBtn) {
    cashoutSaveReportBtn.addEventListener('click', async () => {
      if (!latestShiftSummary) {
        latestShiftSummary = await refreshLatestShiftSummary();
      }
      const endingCash = parseCashoutEndingCash({ requireValue: true });
      if (endingCash === null) {
        setStatus('Enter ending cash before saving report.');
        cashoutEndingCashInputEl?.reportValidity();
        cashoutEndingCashInputEl?.focus();
        return;
      }
      const report = buildCashoutReport(latestShiftSummary, endingCash);
      downloadCashoutReport(report);
      setStatus('Cashier shift summary report saved.');
    });
  }
  if (cashoutPrintReportBtn) {
    cashoutPrintReportBtn.addEventListener('click', async () => {
      if (!latestShiftSummary) {
        latestShiftSummary = await refreshLatestShiftSummary();
      }
      const endingCash = parseCashoutEndingCash({ requireValue: true });
      if (endingCash === null) {
        setStatus('Enter ending cash before printing summary.');
        cashoutEndingCashInputEl?.reportValidity();
        cashoutEndingCashInputEl?.focus();
        return;
      }
      const report = buildCashoutReport(latestShiftSummary, endingCash);
      printCashoutReport(report);
    });
  }
  if (cashoutConfirmBtn) {
    cashoutConfirmBtn.addEventListener('click', async () => {
      if (!latestShiftSummary) {
        latestShiftSummary = await refreshLatestShiftSummary();
      }
      const endingCash = parseCashoutEndingCash({ requireValue: true });
      if (endingCash === null) {
        setStatus('Enter ending cash before signing out.');
        cashoutEndingCashInputEl?.reportValidity();
        cashoutEndingCashInputEl?.focus();
        return;
      }

      if (cashierShiftState?.shiftId) {
        try {
          const result = await api(`/api/shifts/${encodeURIComponent(cashierShiftState.shiftId)}/end`, {
            method: 'POST',
            headers: buildActorHeaders(),
            body: JSON.stringify({ endingCash })
          });
          latestShiftSummary = toShiftSummaryView(result?.summary, result?.shift) || latestShiftSummary;
        } catch (error) {
          setStatus(`Shift sign-out sync failed: ${error.message}`);
          return;
        }
      }

      renderShiftSummary(cashoutSummaryEl, latestShiftSummary, {
        endingCash: Number(latestShiftSummary?.endingCash ?? endingCash)
      });
      updateCashoutDiscrepancyStatus(latestShiftSummary);
      await finalizeLogout();
    });
  }
  if (offlineSyncBtn) {
    offlineSyncBtn.addEventListener('click', () => {
      triggerOfflineSync().catch(() => {});
    });
  }

  window.addEventListener('online', () => {
    refreshConnectivityStatus({ showTransitionToast: true })
      .then(() => syncClientOfflineOutbox())
      .then(() => refreshConnectivityStatus({ showTransitionToast: false }))
      .catch(() => {});
  });
  window.addEventListener('offline', () => {
    refreshConnectivityStatus({ showTransitionToast: true }).catch(() => {});
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!adminNavContextMenuEl?.hidden) {
        closeAdminNavContextMenu();
        return;
      }
      closeSettingsMenu();
      closeEwalletModal();
      closeScanQrModal();
      if (paymentSuccessModalEl?.classList.contains('open')) {
        closePaymentSuccessModal();
      }
      closeMenuEditor();
      closeAdminReceiptModal();
      closeShiftMonitorModal();
      closeCashoutSummaryModal();
      closeInventoryEditModal();
      closeInventoryDeleteModal();
      closeInventoryHistoryModal();
      closeCashDrawerControlModal();
      closeAdminDashboard();
    }
  });
}

async function init() {
  if (monthlyClosingMonthInputEl && !monthlyClosingMonthInputEl.value) {
    monthlyClosingMonthInputEl.value = getCurrentMonthValue();
  }
  if (monthlyExpenseDateInputEl && !monthlyExpenseDateInputEl.value) {
    monthlyExpenseDateInputEl.value = new Date().toISOString().slice(0, 10);
  }
  restoreAdminNavOrder();
  const persistedUiState = readUserUiState();
  const persistedAdminPanel = normalizeAdminPanelName(persistedUiState.adminPanel);
  const shouldRestoreAdminDashboard = Boolean(persistedUiState.adminOpen) && canAccessAdminFeatures();
  if (shouldRestoreAdminDashboard) {
    await openAdminDashboard({ panelName: persistedAdminPanel, persist: false });
  }
  const persistedCategory = String(persistedUiState.activeCategory || '').trim().toLowerCase();
  if (persistedCategory) {
    state.activeCategory = persistedCategory;
  }
  if (persistedUiState.salesRange === 'daily' || persistedUiState.salesRange === 'weekly') {
    activeSalesRange = persistedUiState.salesRange;
  }
  activeSalesOpsRange = normalizeSalesOpsRange(persistedUiState.salesOpsRange);
  activeSalesOpsHourlyView = normalizeSalesOpsHourlyView(persistedUiState.salesOpsHourlyView);
  activeSalesOpsWeekdayView = normalizeSalesOpsWeekdayView(persistedUiState.salesOpsWeekdayView);
  if (salesOpsRangeEl) {
    salesOpsRangeEl.value = activeSalesOpsRange;
  }
  if (salesOpsMonthPickerEl) {
    salesOpsMonthPickerEl.value = String(persistedUiState.salesOpsMonth || getCurrentMonthValue()).trim();
  }
  syncSalesOpsMonthPickerVisibility(activeSalesOpsRange);

  const cachedOrFallbackCatalog = readCatalogCache() || getBootstrapCatalogFallback();
  const hasCachedCatalog = hydrateCatalogState(cachedOrFallbackCatalog, { keepCategory: true });
  if (hasCachedCatalog) {
    renderCategoryButtons();
    switchCategory(state.activeCategory);
    renderCart();
    preloadProductImages(state.products);
  } else {
    if (categoryButtonsEl) categoryButtonsEl.innerHTML = '<p class="status">Loading menu...</p>';
    if (productsEl) productsEl.innerHTML = '<p style="text-align:center;color:#6b7280;padding:20px;">Loading products...</p>';
  }

  const configPromise = api('/api/config').catch(() => ({}));
  const catalogPromise = refreshCatalog({ keepCategory: true }).catch((error) => {
    if (!hasCachedCatalog) {
      setStatus(`Menu load error: ${error.message}`);
    }
  });

  ensureConfettiAnimation();
  ensureYummyAnimations();
  registerServiceWorker();

  setupEventListeners();
  setLatestAdminReport(null);
  updateReceiptActionVisibility();
  applyActiveReceiptTemplate();
  startConnectivityMonitor();
  updatePaymentActionAvailability();
  setPaymentMethod('cash');
  setStatus('Select order type first: Dine In or Take Out.');
  const [configResult] = await Promise.all([configPromise, catalogPromise]);
  applyAppConfig(configResult?.appConfig || state.appConfig);
  applyReceiptTemplatesState({
    activeReceiptTemplate: configResult?.activeReceiptTemplate || state.activeReceiptTemplate || DEFAULT_RECEIPT_TEMPLATE
  });
  await refreshSalesReport(activeSalesRange);

  if (canAccessMenuEditor()) {
    warmMenuEditorInBackground();
  }

}

bootstrap().catch((error) => {
  setAuthMessage(`Authentication startup error: ${error.message}`);
});
