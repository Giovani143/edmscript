/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 */
define(['N/search', 'N/record'], function (search, record) {

    function beforeSubmit(context) {
        if (context.type !== context.UserEventType.CREATE) return;

        var newRec = context.newRecord;
        var shopifyCompName = newRec.getValue('custrecord_edm_shopify_comp_name');
        if (!shopifyCompName) return;

        var existingSearch = search.create({
            type: 'customrecord_localisations_horizon',
            filters: [
                ['custrecord_edm_shopify_comp_name', 'is', shopifyCompName]
            ],
            columns: [
                'custrecord_shop_comp_id'
            ]
        });

        var existingId = null;
        var existingShopCompId = null;

        var resultSet = existingSearch.run().getRange({ start: 0, end: 1 });
        if (resultSet.length > 0) {
            existingId = resultSet[0].id;
            existingShopCompId = resultSet[0].getValue('custrecord_shop_comp_id');
        }

        if (existingShopCompId) {
            newRec.setValue({
                fieldId: 'custrecord_shop_comp_id',
                value: existingShopCompId
            });
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});
