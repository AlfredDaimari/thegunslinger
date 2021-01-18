/* 
file for implementing levenshtein distance 
*/

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

function levenshteinDistance(string1, string2) {
  var arr = [];
  for (let i = 0; i <= string2.length; i += 1) {
    arr[i] = [i];
  }
  for (let j = 0; j <= string1.length; j += 1) {
    arr[0][j] = j;
  }

  for (let i = 1; i <= string2.length; i++) {
    for (let j = 1; j <= string1.length; j++) {
      if (string2.charAt(i - 1) == string1.charAt(j - 1)) {
        arr[i][j] = arr[i - 1][j - 1];
      } else {
        arr[i][j] = Math.min(
          arr[i - 1][j - 1] + 1,
          arr[i][j - 1] + 1,
          arr[i - 1][j] + 1
        );
      }
    }
  }

  return arr[string2.length][string1.length];
}

function levDis(string) {
  let levDist = 1000,
    min = -1;
  for (let i in products) {
    let newlevDist = levenshteinDistance(string, products[i]);
    if (levDist > newlevDist) {
      levDist = newlevDist;
      min = i;
    }
  }
  return products[min];
}

module.exports = levDis;
