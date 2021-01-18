// file for search auto recommendation

const products = [
  "shire",
  "nokota",
  "mercer",
  "arabian",
  "mustang",
  "belgian",
  "dechaux",
  "roanoke",
  "ajaccio",
  "quinton",
  "clayton",
  "ardennes",
  "turkoman",
  "dauphine",
  "kimberly",
  "zacateca",
  "appaloosa",
  "andalusian",
  "redington",
  "hettinger",
  "scheffield",
  "summerfield",
  "thoroughbred",
  "rare shotgun",
  "breckenridge",
  "mauser pistol",
  "navy revolver",
  "carcano rifle",
  "suffolk punch",
  "lemat revolver",
  "elephant rifle",
  "evans repeater",
  "dutch warmblood",
  "tennessee walker",
  "grizzlies outlaw",
  "bolt action rifle",
  "semi auto shotgun",
  "repeating shotgun",
  "lancester repeater",
  "hungarian halfbred",
  "cattleman revolver",
  "litchfield repeater",
  "rolling block rifle",
  "missouri fox trotter",
  "pump action shotgun ",
  "semi automatic pistol",
  "american standardbred",
];

function autoRecom(str) {
  str = new RegExp(str, "i");
  var recoms = [];
  for (let prod of products) {
    if (prod.match(str)) {
      recoms.push(prod);
    }
    // maximum of 4 suggestions
    if (recoms.length === 4) {
      return recoms;
    }
  }

  return recoms;
}

module.exports = autoRecom;
