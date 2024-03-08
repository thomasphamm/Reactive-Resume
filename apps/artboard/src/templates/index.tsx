import { Template } from "@reactive-resume/utils";

import { Azurill } from "./azurill";
import { Bronzor } from "./bronzor";
import { Chikorita } from "./chikorita";
import { Ditto } from "./ditto";
import { Gengar } from "./gengar";
import { Glalie } from "./glalie";
import { Robyn } from "./robyn";
import { Bondar } from "./bondar";
import { Kakuna } from "./kakuna";
import { Leafish } from "./leafish";
import { Nosepass } from "./nosepass";
import { Onyx } from "./onyx";
import { Pikachu } from "./pikachu";
import { Rhyhorn } from "./rhyhorn";
import { Curriculum } from "./curriculum";

export const getTemplate = (template: Template) => {
  switch (template) {
    case "azurill":
      return Azurill;
    case "bronzor":
      return Bronzor;
    case "chikorita":
      return Chikorita;
    case "ditto":
      return Ditto;
    case "gengar":
      return Gengar;
    case "glalie":
      return Glalie;
    case "kakuna":
      return Kakuna;
    case "leafish":
      return Leafish;
    case "nosepass":
      return Nosepass;
    case "onyx":
      return Onyx;
    case "pikachu":
      return Pikachu;
    case "rhyhorn":
      return Rhyhorn;
    case "curriculum":
      return Curriculum;
    case "robyn":
      return Robyn;
    case "bondar":
      return Bondar;
    default:
      return Onyx;
  }
};
