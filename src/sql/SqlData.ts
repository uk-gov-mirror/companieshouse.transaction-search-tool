class SqlData {

    public static transactionSQL: string = 
    `SELECT t.FORM_BARCODE, t.TRANSACTION_ID, TO_CHAR(t.TRANSACTION_STATUS_DATE, 'DD-MM-YYYY HH:MI:SS') as "TRANSACTION_STATUS_DATE", cb.INCORPORATION_NUMBER, tst.TRANSACTION_STATUS_DESC, tdx.INPUT_DOCUMENT_ID
    FROM TRANSACTION_STATUS_TYPE tst, TRANSACTION_DOC_XML tdx, TRANSACTION t
    LEFT OUTER JOIN CORPORATE_BODY cb
    ON t.CORPORATE_BODY_ID = cb.CORPORATE_BODY_ID
    WHERE  t.TRANSACTION_ID = tdx.TRANSACTION_ID AND t.TRANSACTION_STATUS_TYPE_ID = tst.TRANSACTION_STATUS_TYPE_ID
    AND t.FORM_BARCODE = :barcode AND ROWNUM = 1`
    
    public static getQueueAndUserFromDocumentSQL: string =
    `SELECT O_QUEUENAME, O_QPARAM1
    FROM STAFFO
    WHERE O_CASENUM = (
        SELECT CASENUM 
        FROM CASE_DATA 
        WHERE FIELD_NAME = 'X_QHADOCID' 
        AND PROC_ID = 26
        AND FIELD_VALUE = :documentId
        AND ROWNUM = 1
    )
    AND ROWNUM = 1`

    public static orgUnitSql: string = 
    `SELECT ORGANISATIONAL_UNIT_DESC
    FROM ORGANISATIONAL_UNIT
    WHERE ORGANISATIONAL_UNIT_ID = :org_unit_id`;

    public static userSql: string =
    `SELECT LOGIN_ID
    FROM USER_ACCESS
    WHERE USER_ACCESS_ID = :user_id`;

    public static fesTransactionSql: string =
    `SELECT f.FORM_ENVELOPE_ID, TO_CHAR(f.FORM_BARCODE_DATE, 'DD-MM-YYYY HH:MI:SS') as "FORM_BARCODE_DATE", f.FORM_TYPE, fst.FORM_STATUS_TYPE_NAME, ie.IMAGE_EXCEPTION_REASON, ie.IMAGE_EXCEPTION_FREE_TEXT, ie.IMAGE_EXCEPTION_ID
    FROM FORM_STATUS_TYPE fst, FORM f LEFT OUTER JOIN IMAGE_EXCEPTION ie
    on f.FORM_IMAGE_ID = ie.IMAGE_EXCEPTION_IMAGE_ID
    WHERE FORM_BARCODE = :barcode
    AND fst.FORM_STATUS_TYPE_ID = f.FORM_STATUS`

    public static fesRescannedSql: string =
    `SELECT FORM_EVENT_OCCURRED, FORM_EVENT_TEXT
    FROM FORM_EVENT
    WHERE FORM_EVENT_IMAGE_EXCEPTION_ID = :exceptionId`
}

export default SqlData;

