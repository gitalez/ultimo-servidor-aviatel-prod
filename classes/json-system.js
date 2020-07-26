"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const menu_dealer_json_1 = __importDefault(require("../assets/json/menu/menu-dealer.json"));
const menu_admin_json_1 = __importDefault(require("../assets/json/menu/menu-admin.json"));
const login_help_json_1 = __importDefault(require("../assets/json/helps/login-help.json"));
const logout_help_json_1 = __importDefault(require("../assets/json/helps/logout-help.json"));
const recuperar_pass_help_json_1 = __importDefault(require("../assets/json/helps/recuperar-pass-help.json"));
const no_valido_json_1 = __importDefault(require("../assets/json/helps/no-valido.json"));
// esta clase lee un json  de tipo menu-dealer , menu-admin etc 
// uso : 
/*
menuRoutes.post('/get-menu', (req: any, res: Response) => {
   
    const menu = req.body.menu;
    jsonSystem.getMenu(menu).then((respuesta) => {

        res.status(200).json({
            ok: true,
            menu: respuesta
        });
    })
*/
class JsonSystem {
    // para que funcione leer un json : copiar en  tsconfig : 
    /*
    {
      "compilerOptions": {
        "resolveJsonModule": true,
        "esModuleInterop": true
      }
    }
    */
    // contructor con dos metodos, para leer los menu a traves de getmenu
    // este constructor devuelve un json con el menu 
    constructor() {
        this.getMenu('dealer').then((respuesta) => {
            //console.log('menu dealer', respuesta);
        });
        console.log(' ');
        this.getMenu('admin').then((respuesta) => {
            //console.log('menu admin', respuesta);
        });
    }
    ;
    getMenu(menu) {
        return __awaiter(this, void 0, void 0, function* () {
            let respuesta;
            switch (menu) {
                case 'dealer':
                    respuesta = yield menu_dealer_json_1.default; // en respuesta obtenemos el json menuDealer 
                    break;
                case 'admin':
                    respuesta = yield menu_admin_json_1.default;
                    break;
                default:
                    respuesta = yield menu_dealer_json_1.default;
                    break;
            }
            return respuesta;
        });
    }
    getHelp(help) {
        return __awaiter(this, void 0, void 0, function* () {
            let respuesta;
            switch (help) {
                case 'login':
                    respuesta = yield login_help_json_1.default;
                    break;
                case 'logout':
                    respuesta = yield logout_help_json_1.default;
                    break;
                case 'recuperar-pass':
                    respuesta = yield recuperar_pass_help_json_1.default;
                    break;
                default:
                    respuesta = yield no_valido_json_1.default;
                    break;
            }
            return respuesta;
        });
    }
}
exports.default = JsonSystem;
