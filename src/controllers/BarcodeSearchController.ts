import StaffwareResult from "../data/StaffwareResult";
import StaffwareService from "../service/StaffwareService";
import config from "../config";
import { createLogger } from "ch-structured-logging";
import ChipsService from "../service/ChipsService";
import ChipsResult from "../data/ChipsResult";
import FesService from "../service/FesService";
import FesResult from "../data/FesResult";
import DocumentOverviewModel from "../models/DocumentOverviewModel";

const logger = createLogger(config.applicationNamespace);

class BarcodeSearchController {

    chipsService: ChipsService;
    swService: StaffwareService;
    fesService: FesService;

    constructor() {
        this.chipsService = new ChipsService();
        this.swService = new StaffwareService();
        this.fesService = new FesService();
    }

    public getSearchPage(req: any, res: any) {
        res.render("barcodeSearch");
    }

    public async searchBarcode(req: any, res: any) {
        var barcode = req.query.search;
        var chipsResult = await this.chipsService.getTransactionDetailsFromBarcode(barcode);
        var fesResult = await this.fesService.getTransactionDetailsFromBarcode(barcode);

        var staffwareResult: StaffwareResult;
        var orgUnit = '';
        var userLogin= '';

        if (chipsResult.documentId != undefined ) {
            staffwareResult = await this.swService.addStaffwareData(chipsResult.documentId);
            orgUnit = await this.chipsService.getOrgUnitFromId(staffwareResult.orgUnitId);
            userLogin = await this.chipsService.getUserFromId(staffwareResult.userId);
        }

        if (chipsResult.isEmpty() && fesResult.isEmpty()) {
            res.render("barcodeSearch", {
                barcode: barcode,
                error: true
            });
        } else {
            var model = this.createModel(barcode, chipsResult, fesResult, orgUnit, userLogin);
            logger.info(`Barcode searched: ${barcode}, result: ${model.toString()}`);

            res.render("documentOverview", {
                barcode: barcode,
                result: model.getModel()
            });
        }
    }

    private createModel(barcode: string, chipsResult: ChipsResult, fesResult: FesResult, orgUnit: string, userLogin: string): DocumentOverviewModel {
        var model = new DocumentOverviewModel();
        model.formBarcode = barcode;
        model.documentId = chipsResult.documentId;
        model.chipsStatus = chipsResult.chipsStatus;
        model.transactionId = chipsResult.transactionId;
        model.incorporationNumber = chipsResult.incorporationNumber;
        model.transactionDate = chipsResult.transactionDate;
        model.formType = fesResult.formType;
        model.orgUnit = orgUnit;
        model.user = userLogin;
        model.envNo = fesResult.envNo;
        model.scanTime = fesResult.scanTime;
        model.fesStatus = fesResult.fesStatus;
        model.icoReturnedReason = fesResult.icoReturnedReason;
        model.icoAction = fesResult.icoAction;
        model.eventOccurredTime = fesResult.eventOccurredTime;
        model.eventText = fesResult.eventText;
        return model;
    }

}

export default BarcodeSearchController;