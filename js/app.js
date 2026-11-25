/* Miami, together · app */
(function () {
"use strict";

/* ================= Helpers ================= */
var $ = function (s, r) { return (r || document).querySelector(s); };
var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }
function fmt(s) { return esc(s).replace(/_(.+?)_/g, "<em>$1</em>"); }          // _text_ → <em>
function plain(s) { return String(s).replace(/_/g, ""); }
function icon(id) { return '<svg class="i"><use href="#i-' + id + '"/></svg>'; }
function gmaps(q) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q); }
function store(k, v) {
  try {
    if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null");
    localStorage.setItem(k, JSON.stringify(v));
  } catch (e) { return null; }
}
var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
var toastTimer;
function toast(t) {
  var el = $("#toast"); el.textContent = t; el.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove("show"); }, 3200);
}

/* ================= Photos ================= */
var PHOTOS = {
  coast:   {src:"assets/img/coast.webp", by:"Mylo Kaye", lic:"Pexels License", page:"https://www.pexels.com/photo/birds-eye-view-of-a-beach-in-miami-florida-11094897/", name:"Miami Beach from above"},
  skylineSunset:{src:"assets/img/skyline-sunset.webp", by:"Unsplash", lic:"Unsplash License", page:"https://images.unsplash.com/photo-1535498730771-e735b998cd64", name:"Miami skyline at sunset"},
  skyline: {src:"assets/img/skyline.webp", by:"P. Hughes", lic:"CC BY-SA 4.0", page:"https://commons.wikimedia.org/wiki/File:Miami_-_Skyline_from_Harbor.jpg", name:"Miami skyline from Biscayne Bay"},
  tower:   {src:"assets/img/tower.webp", by:"bebatut", lic:"CC BY-SA 2.0", page:"https://commons.wikimedia.org/wiki/File:South_Beach_%40_Miami.jpg", name:"South Beach lifeguard tower"},
  gator:   {src:"assets/img/gator.webp", by:"NPS / Omar Barrera", lic:"Public domain", page:"https://commons.wikimedia.org/wiki/File:Everglades_Shark_Valley_Program_%2855339570344%29.jpg", name:"Alligator in Shark Valley"},
  airboat: {src:"assets/img/airboat.webp", by:"Cacophony", lic:"CC BY 2.5", page:"https://commons.wikimedia.org/wiki/File:Everglades-airboat.jpg", name:"Airboats in the Everglades"},
  snorkel: {src:"assets/img/snorkel.webp", by:"National Park Service", lic:"Public domain", page:"https://commons.wikimedia.org/wiki/File:Biscayne_NP_snorkeling.jpg", name:"Snorkeling in Biscayne National Park"},
  zoo:     {src:"assets/img/zoo.webp", by:"Jedi94", lic:"CC BY-SA 3.0", page:"https://commons.wikimedia.org/wiki/File:Samburu_Giraffe_Feeding_Station_at_Zoo_Miami.jpg", name:"Giraffes at Zoo Miami"},
  vizcaya: {src:"assets/img/vizcaya.webp", by:"Daderot", lic:"CC0", page:"https://commons.wikimedia.org/wiki/File:Villa_from_the_gardens_-_Vizcaya_Museum_and_Gardens_-_Miami%2C_Florida_-_DSC08678.jpg", name:"Vizcaya villa and gardens"},
  wynwood: {src:"assets/img/wynwood.webp", by:"Dan Lundberg", lic:"CC BY-SA 2.0", page:"https://commons.wikimedia.org/wiki/File:Wynwood_Walls_Miami_Florida_October_2013.jpg", name:"Wynwood Walls"},
  frost:   {src:"assets/img/frost.webp", by:"Dan Lundberg", lic:"CC BY-SA 2.0", page:"https://commons.wikimedia.org/wiki/File:20170829_Miami_1881_Frost_Science_Museum_sRGB.jpg", name:"Frost Science aquarium"},
  garden:  {src:"assets/img/garden.webp", by:"Daderot", lic:"Public domain", page:"https://commons.wikimedia.org/wiki/File:Miami_Beach_Botanical_Garden_-_IMG_8018.JPG", name:"Miami Beach Botanical Garden"}
};
/* A few extra places, served from Wikimedia Commons */
PHOTOS.havana = {"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Little_Havana_Dominos_Park.JPG/1280px-Little_Havana_Dominos_Park.JPG", "big": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Little_Havana_Dominos_Park.JPG/1280px-Little_Havana_Dominos_Park.JPG", "md": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Little_Havana_Dominos_Park.JPG/960px-Little_Havana_Dominos_Park.JPG", "sm": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Little_Havana_Dominos_Park.JPG/500px-Little_Havana_Dominos_Park.JPG", "by": "Infrogmation of New Orleans", "lic": "CC BY-SA 3.0", "page": "https://commons.wikimedia.org/wiki/File:Little_Havana_Dominos_Park.JPG", "name": "Domino Park, Little Havana"};
PHOTOS.deco = {"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Ocean_Drive_-_Art_Deco_buildings_in_Miami_%285410502514%29.jpg/1280px-Ocean_Drive_-_Art_Deco_buildings_in_Miami_%285410502514%29.jpg", "big": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Ocean_Drive_-_Art_Deco_buildings_in_Miami_%285410502514%29.jpg/1280px-Ocean_Drive_-_Art_Deco_buildings_in_Miami_%285410502514%29.jpg", "md": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Ocean_Drive_-_Art_Deco_buildings_in_Miami_%285410502514%29.jpg/960px-Ocean_Drive_-_Art_Deco_buildings_in_Miami_%285410502514%29.jpg", "sm": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Ocean_Drive_-_Art_Deco_buildings_in_Miami_%285410502514%29.jpg/500px-Ocean_Drive_-_Art_Deco_buildings_in_Miami_%285410502514%29.jpg", "by": "Jorge Láscar", "lic": "CC BY 2.0", "page": "https://commons.wikimedia.org/wiki/File:Ocean_Drive_-_Art_Deco_buildings_in_Miami_%285410502514%29.jpg", "name": "Art Deco buildings on Ocean Drive"};
PHOTOS.southpointe = {"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/South_Pointe_Park_Pier.jpg/1280px-South_Pointe_Park_Pier.jpg", "big": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/South_Pointe_Park_Pier.jpg/1280px-South_Pointe_Park_Pier.jpg", "md": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/South_Pointe_Park_Pier.jpg/960px-South_Pointe_Park_Pier.jpg", "sm": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/South_Pointe_Park_Pier.jpg/500px-South_Pointe_Park_Pier.jpg", "by": "Visitor7", "lic": "CC BY-SA 3.0", "page": "https://commons.wikimedia.org/wiki/File:South_Pointe_Park_Pier.jpg", "name": "South Pointe Park pier"};
PHOTOS.espanola = {"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Espanola_Way_South_Beach%2C_Miami_Beach_Florida_January_2026_-_04.jpg/1280px-Espanola_Way_South_Beach%2C_Miami_Beach_Florida_January_2026_-_04.jpg", "big": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Espanola_Way_South_Beach%2C_Miami_Beach_Florida_January_2026_-_04.jpg/1280px-Espanola_Way_South_Beach%2C_Miami_Beach_Florida_January_2026_-_04.jpg", "md": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Espanola_Way_South_Beach%2C_Miami_Beach_Florida_January_2026_-_04.jpg/960px-Espanola_Way_South_Beach%2C_Miami_Beach_Florida_January_2026_-_04.jpg", "sm": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Espanola_Way_South_Beach%2C_Miami_Beach_Florida_January_2026_-_04.jpg/500px-Espanola_Way_South_Beach%2C_Miami_Beach_Florida_January_2026_-_04.jpg", "by": "Phillip Pessar", "lic": "CC BY 4.0", "page": "https://commons.wikimedia.org/wiki/File:Espanola_Way_South_Beach%2C_Miami_Beach_Florida_January_2026_-_04.jpg", "name": "Española Way"};
PHOTOS.mangrove = {"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Biscayne_National_Park_H-mangrove_shoreline.jpg/1280px-Biscayne_National_Park_H-mangrove_shoreline.jpg", "big": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Biscayne_National_Park_H-mangrove_shoreline.jpg/1280px-Biscayne_National_Park_H-mangrove_shoreline.jpg", "md": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Biscayne_National_Park_H-mangrove_shoreline.jpg/960px-Biscayne_National_Park_H-mangrove_shoreline.jpg", "sm": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Biscayne_National_Park_H-mangrove_shoreline.jpg/500px-Biscayne_National_Park_H-mangrove_shoreline.jpg", "by": "National Park Service", "lic": "Public domain", "page": "https://commons.wikimedia.org/wiki/File:Biscayne_National_Park_H-mangrove_shoreline.jpg", "name": "Mangrove shoreline, Biscayne Bay"};
PHOTOS.bayside = {"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Miami-Bayside.jpg/1280px-Miami-Bayside.jpg", "big": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Miami-Bayside.jpg/1280px-Miami-Bayside.jpg", "md": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Miami-Bayside.jpg/960px-Miami-Bayside.jpg", "sm": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Miami-Bayside.jpg/500px-Miami-Bayside.jpg", "by": "Kolossos", "lic": "CC BY-SA 3.0", "page": "https://commons.wikimedia.org/wiki/File:Miami-Bayside.jpg", "name": "Bayside Marketplace"};
PHOTOS.jungle = {"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Two_different_macaws_-Jungle_Island_-Miami-6a.jpg/1280px-Two_different_macaws_-Jungle_Island_-Miami-6a.jpg", "big": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Two_different_macaws_-Jungle_Island_-Miami-6a.jpg/1280px-Two_different_macaws_-Jungle_Island_-Miami-6a.jpg", "md": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Two_different_macaws_-Jungle_Island_-Miami-6a.jpg/960px-Two_different_macaws_-Jungle_Island_-Miami-6a.jpg", "sm": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Two_different_macaws_-Jungle_Island_-Miami-6a.jpg/500px-Two_different_macaws_-Jungle_Island_-Miami-6a.jpg", "by": "Keith Allison", "lic": "CC BY-SA 2.0", "page": "https://commons.wikimedia.org/wiki/File:Two_different_macaws_-Jungle_Island_-Miami-6a.jpg", "name": "Macaws at Jungle Island"};
PHOTOS.memorial = {"src": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Memoriale_dell%27olocausto_di_Miami_Beach.jpg/1280px-Memoriale_dell%27olocausto_di_Miami_Beach.jpg", "big": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Memoriale_dell%27olocausto_di_Miami_Beach.jpg/1280px-Memoriale_dell%27olocausto_di_Miami_Beach.jpg", "md": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Memoriale_dell%27olocausto_di_Miami_Beach.jpg/960px-Memoriale_dell%27olocausto_di_Miami_Beach.jpg", "sm": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Memoriale_dell%27olocausto_di_Miami_Beach.jpg/500px-Memoriale_dell%27olocausto_di_Miami_Beach.jpg", "by": "Giu.gent93", "lic": "CC BY-SA 4.0", "page": "https://commons.wikimedia.org/wiki/File:Memoriale_dell%27olocausto_di_Miami_Beach.jpg", "name": "Holocaust Memorial, Miami Beach"};

/* ================= Map stops ================= */
var STOPS = {
  mia:        {n:"Miami Airport (MIA) & rental cars", lat:25.7959, lng:-80.2870, home:true},
  home1:      {n:"Home base · Doral", lat:25.8103, lng:-80.3686, home:true},
  home2:      {n:"Home base · South Beach", lat:25.7737, lng:-80.1338, home:true},
  cityplace:  {n:"CityPlace Doral", lat:25.8120, lng:-80.3510},
  shark:      {n:"Shark Valley, Everglades National Park", lat:25.7576, lng:-80.7664, ph:"gator"},
  coopertown: {n:"Coopertown Airboat Tours", lat:25.7618, lng:-80.5778, ph:"airboat"},
  dinnerkey:  {n:"Dinner Key Marina, Coconut Grove", lat:25.7270, lng:-80.2330, ph:"snorkel"},
  zoo:        {n:"Zoo Miami", lat:25.6106, lng:-80.3977, ph:"zoo"},
  vizcaya:    {n:"Vizcaya Museum & Gardens", lat:25.7443, lng:-80.2105, ph:"vizcaya"},
  havana:     {n:"Little Havana (Calle Ocho)", lat:25.7653, lng:-80.2190, ph:"havana"},
  southpointe:{n:"South Pointe Park", lat:25.7660, lng:-80.1340, ph:"southpointe"},
  ocean:      {n:"Ocean Drive & Art Deco district", lat:25.7810, lng:-80.1305, ph:"deco"},
  espanola:   {n:"Española Way", lat:25.7864, lng:-80.1326, ph:"espanola"},
  bigbus:     {n:"Big Bus stop, 555 Washington Ave", lat:25.7750, lng:-80.1350},
  wynwood:    {n:"Wynwood Walls", lat:25.8010, lng:-80.1994, ph:"wynwood"},
  bayside:    {n:"Bayside Marketplace", lat:25.7785, lng:-80.1867, ph:"bayside"},
  frost:      {n:"Frost Science Museum", lat:25.7853, lng:-80.1880, ph:"frost"},
  jungle:     {n:"Jungle Island (Luminosa)", lat:25.7848, lng:-80.1720, ph:"jungle"},
  lincoln:    {n:"Lincoln Road", lat:25.7907, lng:-80.1390},
  garden:     {n:"Miami Beach Botanical Garden", lat:25.7953, lng:-80.1360, ph:"garden"},
  memorial:   {n:"Holocaust Memorial Miami Beach", lat:25.7966, lng:-80.1375, ph:"memorial"}
};

/* ================= Days ================= */
function B(when, what, txt, stop) { return {when:when, what:what, txt:txt || "", stop:stop || null}; }
var D = {
  arrive: {key:"arrive", label:"Arrive", theme:"Arrival", c:1, photo:"skylineSunset", place:"Hello, Miami",
    title:"Touch down, _slow down._", sum:"Land, pick up the car and settle into Doral as the year turns over.",
    blocks:[
      B("Daytime","Fly into Miami (MIA)","Pick up the rental car at the airport's rental car center.","mia"),
      B("Afternoon","Check in at our Doral hotel","A suite with two queens and a sofa bed. Breakfast and parking are included.","home1"),
      B("Evening","New Year's Eve","CityPlace Doral if it announces fireworks; otherwise dinner nearby and an early night before the Everglades.","cityplace")
    ], links:[]},
  everglades: {key:"everglades", label:"Everglades", theme:"Wild Florida", c:1, photo:"gator", place:"Everglades National Park",
    title:"New year, _new neighbors._", sum:"Our big nature day. We start early, before Shark Valley gets busy.",
    blocks:[
      B("Before leaving","Buy the National Parks pass","Digital America the Beautiful pass on Recreation.gov. The buyer needs photo ID in the car."),
      B("From 8:30 AM","Shark Valley","Bike the flat 15-mile loop or ride the tram. Plenty of alligators along the canal.","shark"),
      B("Afternoon","Coopertown airboat","On the drive back east. No reservation needed; the last boat leaves at 4:30 PM.","coopertown"),
      B("Evening","Cuban dinner on Tamiami Trail","Along US-41 on the way back to the hotel.")
    ], bring:["Hats","Sunscreen","Water","Bug spray","Photo ID"],
    links:[["Shark Valley tram & bikes","https://www.sharkvalleytramtours.com/"],["National Parks pass","https://www.nps.gov/planyourvisit/passes.htm"]]},
  snorkel: {key:"snorkel", label:"Biscayne", theme:"Ocean day", c:1, photo:"snorkel", place:"Biscayne National Park",
    title:"Masks on, _reef below._", sum:"Snorkeling and an island visit in a national park that's about 95 percent water.",
    blocks:[
      B("Booked time","Snorkel & island trip","Leaves from Dinner Key Marina in Coconut Grove. The departure time is on our booking; ages 8+, snorkel vests provided.","dinnerkey"),
      B("Around it","Coconut Grove","A stroll and a meal in the Grove, near the marina."),
      B("Evening","Dinner and an easy night","")
    ], bring:["Swimsuits","Towels","Warm layer","Dry clothes","Reef-safe sunscreen"],
    note:"Weather-dependent. We check the marine forecast Dec 29–30 and switch by about 9 AM Dec 31, before the 48-hour refund window closes.",
    links:[["Biscayne snorkel trip","https://www.biscaynenationalparkinstitute.org/snorkel-and-island-visit-from-coconut-grove/"]]},
  zoo: {key:"zoo", label:"Zoo Miami", theme:"Plan B · Wildlife", c:1, photo:"zoo", place:"Zoo Miami",
    title:"Giraffes, _not reefs._", sum:"Our land-based backup if the ocean has other plans.",
    blocks:[
      B("Morning","Zoo Miami","A big open-air zoo. Rent a Safari Cycle to cover more ground (an adult has to drive it).","zoo"),
      B("Afternoon","Keep exploring","Tickets are cheaper online."),
      B("Evening","Dinner and an easy night","")
    ], bring:["Hats","Sunscreen","Water","Comfortable shoes"],
    links:[["Zoo Miami tickets","https://shop.zoomiami.org/mainstore"]]},
  cruise: {key:"cruise", label:"On the bay", theme:"Plan B · No swim", c:1, photo:"mangrove", place:"Biscayne Bay",
    title:"The bay, _from the deck._", sum:"A boat day without getting wet, for a cool or windy morning.",
    blocks:[
      B("Morning","Biscayne Bay cruise","A boat trip on the bay with no snorkeling. Confirm the departure point when booking.","dinnerkey"),
      B("Afternoon","Coconut Grove","Lunch and a walk around the Grove."),
      B("Evening","Dinner and an easy night","")
    ], bring:["Warm layer","Sunglasses","Hats"], links:[]},
  vizcaya: {key:"vizcaya", label:"Vizcaya", theme:"Culture & coast", c:1, photo:"vizcaya", place:"Vizcaya · Little Havana",
    title:"Gardens, cafecito _& the coast._", sum:"Moving day: one last morning with the car, then the beach week begins.",
    blocks:[
      B("9:30 AM","Vizcaya Museum & Gardens","Check out first; the bags stay in the trunk. A villa and formal gardens on Biscayne Bay.","vizcaya"),
      B("Lunch","Little Havana","Calle Ocho, Domino Park, Cuban coffee and lunch.","havana"),
      B("2–3 PM","Return the car at MIA","Then an Uber to South Beach.","mia"),
      B("4 PM","Check in at our South Beach hotel","Steps from the sand.","home2"),
      B("Sunset","South Pointe Park","A short walk from the hotel.","southpointe")
    ], links:[["Vizcaya tickets","https://vizcaya.org/"]]},
  deco: {key:"deco", label:"Art Deco", theme:"Beach day", c:2, photo:"deco", place:"Ocean Drive",
    title:"Pastel mornings, _salt afternoons._", sum:"A walk among the Art Deco facades, then a long beach afternoon.",
    blocks:[
      B("Morning","Ocean Drive & the Art Deco district","On our own, or with the official Art Deco walking tour.","ocean"),
      B("Noon – 4:30","Beach","The warmest part of the day."),
      B("Evening","Dinner on Española Way","A pedestrian street of Mediterranean-style buildings and restaurants.","espanola")
    ], links:[["Art Deco walking tour","https://feverup.com/m/172735"]]},
  cityDry: {key:"city", label:"City day", theme:"City day", c:2, photo:"frost", place:"Wynwood · Downtown",
    title:"Murals, sharks _& city light._", sum:"Our mainland day, on the least beachy day of the week.",
    blocks:[
      B("9:20 AM","Big Bus from Washington Ave","First bus from the South Beach stop; buses run about every 30 minutes.","bigbus"),
      B("Late morning","Wynwood Walls","Huge outdoor murals. Opens 10:30 AM; free for kids 12 and under.","wynwood"),
      B("Lunch","Bayside Marketplace","Waterfront shops and food by the port.","bayside"),
      B("Afternoon","Frost Science Museum","Aquarium, exhibits and a planetarium show.","frost"),
      B("Evening · optional","Luminosa at Jungle Island","A walk-through light show; 5:30 or 6 PM entry.","jungle")
    ], bring:["Light jackets for the open-top bus"],
    links:[["Big Bus","https://www.bigbustours.com/en/miami/miami-bus-tours"],["Wynwood Walls","https://thewynwoodwalls.com/admissions"],["Frost Science","https://www.frostscience.org/"],["Luminosa","https://feverup.com/m/781881"]]},
  cityWet: {key:"city", label:"City day", theme:"Rainy-day plan", c:2, photo:"frost", place:"Frost Science",
    title:"Rain outside, _oceans inside._", sum:"Skip the open-top bus; the museum carries the day.",
    blocks:[
      B("Morning","Uber to Downtown","About 20 minutes from South Beach."),
      B("Late morning","Frost Science Museum","Aquarium, planetarium and indoor exhibits.","frost"),
      B("Lunch","Bayside Marketplace","If it clears; otherwise the museum café.","bayside"),
      B("Evening","Luminosa, only if it clears","Otherwise a cozy dinner near the hotel.","jungle")
    ], links:[["Frost Science","https://www.frostscience.org/"]]},
  garden: {key:"garden", label:"Gardens", theme:"Beach day", c:2, photo:"garden", place:"Lincoln Road · Gardens",
    title:"Garden paths, _then the sand._", sum:"A short free-trolley ride north, then back for the beach.",
    blocks:[
      B("Morning","Lincoln Road","Pedestrian mall with shops and cafés.","lincoln"),
      B("Late morning","Botanical Garden","Free, and a quiet green break.","garden"),
      B("Late morning","Holocaust Memorial","Next door to the garden. Visit in daylight.","memorial"),
      B("Afternoon","Beach",""),
      B("Evening","Waterfront walk and dinner","")
    ], links:[]},
  home: {key:"home", label:"Homeward", theme:"Homeward", c:2, photo:"tower", place:"One last look",
    title:"One more _barefoot walk._", sum:"An easy last morning by the water.",
    blocks:[
      B("By 11 AM","Check out","The hotel holds our bags.","home2"),
      B("Midday","Last beach walk","Or a ride on the Collins Express trolley."),
      B("Then","Uber to the airport","In time for the flight.","mia")
    ], links:[]}
};
var DATES = [
  {w:"Thu", d:"Dec 31", long:"Thursday, December 31", iso:"2026-12-31"},
  {w:"Fri", d:"Jan 1",  long:"Friday, January 1",     iso:"2027-01-01"},
  {w:"Sat", d:"Jan 2",  long:"Saturday, January 2",   iso:"2027-01-02"},
  {w:"Sun", d:"Jan 3",  long:"Sunday, January 3",     iso:"2027-01-03"},
  {w:"Mon", d:"Jan 4",  long:"Monday, January 4",     iso:"2027-01-04"},
  {w:"Tue", d:"Jan 5",  long:"Tuesday, January 5",    iso:"2027-01-05"},
  {w:"Wed", d:"Jan 6",  long:"Wednesday, January 6",  iso:"2027-01-06"},
  {w:"Thu", d:"Jan 7",  long:"Thursday, January 7",   iso:"2027-01-07"}
];

/* ================= Plan state (device + share link) ================= */
var DEF = {adv:"snorkel", city:"5", wx:"dry"};
var VALID = {adv:["snorkel","zoo","cruise"], city:["4","5","6"], wx:["dry","wet"]};
var state = Object.assign({}, DEF, store("miami27-plan") || {});
var params = new URLSearchParams(location.search);
Object.keys(DEF).forEach(function (k) {
  if (VALID[k].indexOf(params.get(k)) >= 0) state[k] = params.get(k);
  if (VALID[k].indexOf(state[k]) < 0) state[k] = DEF[k];
});
function days() {
  var c = +state.city, g = c === 6 ? 5 : 6;                       // garden day never on Monday (Jan 4)
  var mid = [4,5,6].map(function (n) { return n === c ? (state.wx === "dry" ? D.cityDry : D.cityWet) : n === g ? D.garden : D.deco; });
  return [D.arrive, D.everglades, D[state.adv], D.vizcaya].concat(mid, [D.home]);
}
function stopsOf(day) {
  var seen = {}, out = [];
  day.blocks.forEach(function (b) { if (b.stop && !seen[b.stop]) { seen[b.stop] = 1; out.push(b.stop); } });
  return out;
}

/* ================= Header, countdown, reveal ================= */
var head = $("#head");
function onScroll() {
  head.classList.toggle("scrolled", window.scrollY > 10);
  if (window.scrollY < 300) $$(".nav-links a.on").forEach(function (a) { a.classList.remove("on"); });
}
window.addEventListener("scroll", onScroll, {passive:true}); onScroll();
if ("IntersectionObserver" in window) {
  var navLinks = {}; $$(".nav-links a").forEach(function (a) { navLinks[a.getAttribute("href").slice(1)] = a; });
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting && navLinks[e.target.id]) {
        $$(".nav-links a").forEach(function (a) { a.classList.remove("on"); });
        navLinks[e.target.id].classList.add("on");
      }
    });
  }, {rootMargin:"-45% 0px -50% 0px"});
  Object.keys(navLinks).forEach(function (id) { var el = document.getElementById(id); if (el) spy.observe(el); });
}
var START = new Date("2026-12-31T00:00:00-05:00"), END = new Date("2027-01-08T00:00:00-05:00");
function tick() {
  var el = $("#countdown"), now = new Date();
  if (now >= END) { el.className = "countdown msg"; el.textContent = "Back home, with stories"; return; }
  if (now >= START) { el.className = "countdown msg"; el.textContent = "Day " + (Math.floor((now - START) / 864e5) + 1) + " of 8 · we're here"; return; }
  var s = Math.floor((START - now) / 1000);
  var p = [[Math.floor(s / 86400),"days"],[Math.floor(s % 86400 / 3600),"hrs"],[Math.floor(s % 3600 / 60),"min"],[s % 60,"sec"]];
  el.className = "countdown";
  el.innerHTML = p.map(function (x) { return "<div><b>" + String(x[0]).padStart(2, "0") + "</b><span>" + x[1] + "</span></div>"; }).join("");
}
tick(); setInterval(tick, 1000);

var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
  es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, {rootMargin:"0px 0px -10% 0px"}) : null;
function reveal(el) { if (!el) return; if (io && !reduced) io.observe(el); else el.classList.add("in"); }
$$(".sec-head, .beach, .city > *, .planner, .wx-grid > *, .closing > *").forEach(function (el) { el.classList.add("reveal"); reveal(el); });

/* ================= Moments + dialog ================= */
var MOMENTS = [
  {ph:"gator", day:1, place:"Everglades", small:"Start the year a little wild", t:"Alligators, _before breakfast._", more:"Shark Valley loop",
    story:"We bike or ride the tram around Shark Valley's 15-mile loop, where alligators sun themselves a few feet from the path. Wading birds, sawgrass to the horizon, and the observation tower at the halfway point."},
  {ph:"airboat", day:1, place:"Everglades", small:"Hold on to your hats", t:"Skimming the _river of grass._", more:"Coopertown airboat",
    story:"An open-air airboat ride across the Everglades sawgrass at Coopertown, on the drive back east from Shark Valley. No reservation needed; the last boat leaves at 4:30 PM."},
  {ph:"snorkel", day:2, place:"Biscayne", small:"If the ocean plays along", t:"A park that's _mostly water._", more:"Snorkel + island visit",
    story:"Biscayne National Park is about 95 percent water. We take a boat from Coconut Grove to snorkel shallow reefs and visit an island. If the wind picks up, we switch to Zoo Miami or a no-swim cruise."},
  {ph:"vizcaya", day:3, place:"Coconut Grove", small:"A century-old daydream", t:"A villa _on the bay._", more:"Vizcaya Museum & Gardens",
    story:"An Italian Renaissance–style villa and formal gardens on Biscayne Bay, built about a century ago. We arrive at opening, 9:30 AM, before the move to the beach."},
  {ph:"havana", day:3, place:"Little Havana", small:"Cafecito o'clock", t:"Dominoes _& Cuban coffee._", more:"Lunch on Calle Ocho",
    story:"Domino Park, tiny cups of Cuban coffee and a long lunch on Calle Ocho, the heart of Little Havana, before the car goes back."},
  {ph:"wynwood", day:"city", place:"Wynwood", small:"Bring the camera", t:"Walls that _talk back._", more:"Wynwood Walls",
    story:"An outdoor gallery of huge murals by street artists from around the world, reached by open-top bus on our city day. Free for kids 12 and under."},
  {ph:"frost", day:"city", place:"Downtown", small:"Look up", t:"Sharks _overhead._", more:"Frost Science",
    story:"At Frost Science you look up through a giant lens at sharks and rays swimming overhead. Add the planetarium, then Bayside for a late lunch by the water."}
];
function momentDay(m) { return m.day === "city" ? +state.city : m.day; }
function renderMoments() {
  $("#moments-grid").innerHTML = MOMENTS.slice(0, 6).map(function (m, i) {
    var p = PHOTOS[m.ph], di = momentDay(m);
    return '<button class="moment" type="button" data-m="' + i + '" aria-label="' + esc(plain(m.t)) + ', ' + DATES[di].d + '">' +
      '<img src="' + (p.md || p.src) + '" alt="' + esc(p.name) + '" loading="lazy">' +
      '<span class="m-tag">' + DATES[di].d + ' · ' + esc(m.place) + '</span>' +
      '<span class="m-cap"><small>' + esc(m.small) + '</small><strong>' + fmt(m.t) + '</strong>' +
      '<span class="m-more">' + esc(m.more) + '<span class="plus" aria-hidden="true">+</span></span></span></button>';
  }).join("");
  $$(".moment").forEach(function (b) { reveal(b); b.addEventListener("click", function () { openMoment(+b.dataset.m, b); }); });
}
var dlg = $("#dlg"), dlgIdx = 0, dlgReturn = null;
function showMoment(i) {
  dlgIdx = (i + MOMENTS.length) % MOMENTS.length;
  var m = MOMENTS[dlgIdx], p = PHOTOS[m.ph], di = momentDay(m);
  $("#dlg-img").src = p.big || p.src; $("#dlg-img").alt = p.name;
  $("#dlg-meta").textContent = DATES[di].long + " · " + m.place;
  $("#dlg-title").innerHTML = fmt(m.t);
  $("#dlg-text").textContent = m.story;
  $("#dlg-go").textContent = "See day " + (di + 1) + ": " + days()[di].label;
  var c = $("#dlg-credit"); c.href = p.page; c.textContent = "Photo: " + p.by + " · " + p.lic;
}
function openMoment(i, from) {
  dlgReturn = from || null; showMoment(i);
  if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  document.body.style.overflow = "hidden";
}
function closeMoment() { if (dlg.close) dlg.close(); else { dlg.removeAttribute("open"); onDlgClose(); } }
function onDlgClose() { document.body.style.overflow = ""; if (dlgReturn) dlgReturn.focus({preventScroll:true}); }
dlg.addEventListener("close", onDlgClose);
$("#dlg-x").addEventListener("click", closeMoment);
$("#dlg-prev").addEventListener("click", function () { showMoment(dlgIdx - 1); });
$("#dlg-next").addEventListener("click", function () { showMoment(dlgIdx + 1); });
dlg.addEventListener("click", function (e) {
  if (e.target !== dlg) return;
  var r = dlg.getBoundingClientRect();
  if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeMoment();
});
dlg.addEventListener("keydown", function (e) {
  if (e.key === "ArrowRight") showMoment(dlgIdx + 1);
  if (e.key === "ArrowLeft") showMoment(dlgIdx - 1);
});
$("#dlg-go").addEventListener("click", function () { dlgReturn = null; var di = momentDay(MOMENTS[dlgIdx]); closeMoment(); jumpToDay(di); });
$$("[data-moment]").forEach(function (b) {
  b.addEventListener("click", function () {
    var i = MOMENTS.findIndex(function (m) { return m.ph === b.dataset.moment; });
    if (i >= 0) openMoment(i, b);
  });
});

/* ================= Day explorer ================= */
var sel = 0, mediaMode = "photo", allStops = false;
var todayISO = (function (d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); })(new Date());

function renderTabs() {
  var ds = days();
  $("#tabs").innerHTML = ds.map(function (d, i) {
    return '<button class="tab' + (i > 3 ? " p2" : "") + '" role="tab" type="button" id="tab-' + i + '" aria-controls="day" aria-selected="' + (i === sel) + '" tabindex="' + (i === sel ? 0 : -1) + '" data-i="' + i + '">' +
      (DATES[i].iso === todayISO ? '<span class="today" title="Today"></span>' : '') +
      '<span class="w">' + DATES[i].w.toUpperCase() + '</span><span class="d">' + DATES[i].d + '</span><span class="l">' + esc(d.label) + '</span></button>';
  }).join("");
}
$("#tabs").addEventListener("click", function (e) { var b = e.target.closest("[data-i]"); if (b) select(+b.dataset.i, true); });
$("#tabs").addEventListener("keydown", function (e) {
  var i = sel;
  if (e.key === "ArrowRight") i = Math.min(7, sel + 1); else if (e.key === "ArrowLeft") i = Math.max(0, sel - 1);
  else if (e.key === "Home") i = 0; else if (e.key === "End") i = 7; else return;
  e.preventDefault(); select(i, true, true);
});

function renderDay(animate) {
  var d = days()[sel], st = stopsOf(d), p = PHOTOS[d.photo];
  var fig = $("#media-photo");
  fig.innerHTML = '<img class="' + (animate && !reduced ? "fade-in" : "") + '" src="' + (p.big || p.src) + '" alt="' + esc(p.name) + '">' +
    '<figcaption><span class="place-tag">' + esc(d.place) + '</span><a class="photo-credit" href="' + p.page + '" target="_blank" rel="noopener">Photo: ' + esc(p.by) + ', ' + esc(p.lic) + '</a></figcaption>';

  var h = '<div class="anim">';
  h += '<div class="day-meta"><p class="eyebrow">Day ' + (sel + 1) + ' · ' + DATES[sel].long + '</p><span class="theme' + (d.c === 1 ? " c" : "") + '">' + esc(d.theme) + '</span></div>';
  h += '<h3>' + fmt(d.title) + '</h3><p class="day-sum">' + esc(d.sum) + '</p>';
  h += '<ol class="plan">' + d.blocks.map(function (b) {
    var n = b.stop ? st.indexOf(b.stop) + 1 : 0;
    return '<li><span class="when">' + esc(b.when) + '</span><span><span class="what">' + esc(b.what) + '</span>' + (b.txt ? '<span class="txt">' + esc(b.txt) + '</span>' : '') + '</span>' +
      (n ? '<button class="stop-btn' + (d.c === 2 ? " p2" : "") + '" type="button" data-stop="' + b.stop + '" aria-label="Show ' + esc(STOPS[b.stop].n) + ' on the map">' + n + '</button>' : '<span></span>') + '</li>';
  }).join("") + '</ol>';
  if (d.bring) h += '<div class="bring"><span>Bring</span>' + d.bring.map(function (x) { return '<em>' + esc(x) + '</em>'; }).join("") + '</div>';
  if (d.note) h += '<p class="note">' + icon("info") + '<span>' + esc(d.note) + '</span></p>';
  var links = (d.links || []).map(function (l) { return '<a href="' + l[1] + '" target="_blank" rel="noopener">' + esc(l[0]) + icon("ext") + '</a>'; });
  if (st.length) links.push('<a href="' + gmaps(STOPS[st.filter(function (k) { return !STOPS[k].home; })[0] || st[0]].n + " Miami") + '" target="_blank" rel="noopener">Directions' + icon("pin") + '</a>');
  if (links.length) h += '<div class="links">' + links.join("") + '</div>';
  h += '<div class="day-nav"><button type="button" id="prev-day" ' + (sel === 0 ? "disabled" : "") + '>' + icon("left") + 'Previous</button>' +
       '<button type="button" class="copy-day" id="copy-day">' + icon("link") + 'Link to this day</button>' +
       '<span class="count">' + (sel + 1) + ' / 8</span>' +
       '<button type="button" id="next-day" ' + (sel === 7 ? "disabled" : "") + '>Next' + icon("right") + '</button></div>';
  h += '</div>';
  $("#day-body").innerHTML = h;
  $("#prev-day").addEventListener("click", function () { select(sel - 1, true); });
  $("#next-day").addEventListener("click", function () { select(sel + 1, true); });
  $("#copy-day").addEventListener("click", function () { copyLink(shareURL("day-" + (sel + 1)), "Link to " + DATES[sel].d + " copied"); });
  $$(".stop-btn").forEach(function (b) { b.addEventListener("click", function () { setMedia("map"); focusStop(b.dataset.stop); }); });
}
function select(i, user, focusTab) {
  sel = Math.max(0, Math.min(7, i));
  if (allStops) { allStops = false; $("#map-all").setAttribute("aria-pressed", "false"); }
  renderTabs(); renderDay(user);
  var t = $("#tab-" + sel);
  if (focusTab) t.focus({preventScroll:true});
  if (user && t.scrollIntoView) { var tabs = $("#tabs"); tabs.scrollTo({left:t.offsetLeft - tabs.clientWidth / 2 + t.offsetWidth / 2, behavior:reduced ? "auto" : "smooth"}); }
  if (mediaMode === "map") drawMap();
  if (user && history.replaceState) history.replaceState(null, "", location.pathname + location.search + "#day-" + (sel + 1));
}
function jumpToDay(i) {
  select(i, true);
  $("#days").scrollIntoView({behavior:reduced ? "auto" : "smooth"});
  $("#day").focus({preventScroll:true});
}
$$("[data-jump]").forEach(function (b) {
  b.addEventListener("click", function () {
    var v = b.dataset.jump;
    jumpToDay(v === "city" ? +state.city : days().findIndex(function (d, j) { return j >= 4 && d.key === "deco"; }));
  });
});

/* ---------- Media: photo / map ---------- */
function setMedia(m) {
  mediaMode = m;
  $("#day-media").classList.toggle("show-map", m === "map");
  $$(".media-toggle button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.media === m); });
  if (m === "map") { ensureMap(); setTimeout(function () { if (map) { map.invalidateSize(); drawMap(); } }, 60); }
}
$$(".media-toggle button").forEach(function (b) { b.addEventListener("click", function () { setMedia(b.dataset.media); }); });
$("#map-all").addEventListener("click", function () { allStops = !allStops; this.setAttribute("aria-pressed", allStops); drawMap(); });

var map = null, layer = null, markers = {};
var CORAL = "#C4502F", SEA = "#0F6E6E", INK = "#1E3A31";
function ensureMap() {
  if (map || !window.L) {
    if (!window.L) $("#map").innerHTML = '<p style="padding:24px">The map could not load. Use the Directions links instead.</p>';
    return;
  }
  map = L.map("map", {scrollWheelZoom:false, zoomControl:false});
  L.control.zoom({position:"topright"}).addTo(map);
  var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {maxZoom:19, attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'});
  var esri = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {maxZoom:19, attribution:"Tiles &copy; Esri, HERE, Garmin, &copy; OpenStreetMap contributors"});
  var errs = 0;
  osm.on("tileerror", function () { errs++; if (errs === 4 && map.hasLayer(osm)) { map.removeLayer(osm); esri.addTo(map); } });
  osm.addTo(map);
  layer = L.layerGroup().addTo(map);
  map.setView([25.77, -80.3], 10);
  map.on("click", function () { map.scrollWheelZoom.enable(); });
  map.on("popupopen", function (e) {
    $$(".pop-btn", e.popup.getElement()).forEach(function (b) { b.addEventListener("click", function () { map.closePopup(); allStops = false; $("#map-all").setAttribute("aria-pressed", "false"); select(+b.dataset.go, true); }); });
  });
}
function mk(color, label, o) {
  o = o || {}; var size = o.sm ? 16 : 30;
  return L.divIcon({className:"", html:'<div class="mk' + (o.home ? " home" : "") + (o.sm ? " sm" : "") + '" style="background:' + color + '">' + (label || "") + '</div>', iconSize:[size, size], iconAnchor:[size / 2, size / 2], popupAnchor:[0, -size / 2]});
}
function stopDayIdx(k) { var out = []; days().forEach(function (d, i) { if (d.blocks.some(function (b) { return b.stop === k; })) out.push(i); }); return out; }
function popup(k) {
  var s = STOPS[k], ds = stopDayIdx(k), p = s.ph && PHOTOS[s.ph];
  return (p ? '<img class="pop-img" src="' + (p.sm || p.src) + '" alt="">' : "") + '<strong>' + esc(s.n) + '</strong>' +
    '<span class="pop-d">' + ds.map(function (i) { return DATES[i].d; }).join(", ") + '</span><br><a href="' + gmaps(s.n + " Miami") + '" target="_blank" rel="noopener">Directions</a>' +
    (allStops && ds.length ? '<br>' + ds.map(function (i) { return '<button class="pop-btn" type="button" data-go="' + i + '">Day ' + (i + 1) + '</button>'; }).join(" ") : "");
}
function drawMap() {
  if (!map) return;
  layer.clearLayers(); markers = {};
  var pts = [];
  if (allStops) {
    Object.keys(STOPS).forEach(function (k) {
      var s = STOPS[k], ds = stopDayIdx(k);
      if (!ds.length && !s.home) return;
      var color = s.home ? INK : (ds[0] > 3 ? SEA : CORAL);
      markers[k] = L.marker([s.lat, s.lng], {icon:mk(color, "", {home:s.home, sm:!s.home}), title:s.n}).bindPopup(function () { return popup(k); }).addTo(layer);
      pts.push([s.lat, s.lng]);
    });
  } else {
    var d = days()[sel], st = stopsOf(d), col = d.c === 1 ? CORAL : SEA;
    st.forEach(function (k, i) {
      var s = STOPS[k];
      markers[k] = L.marker([s.lat, s.lng], {icon:mk(s.home ? INK : col, i + 1, {home:s.home}), title:s.n, zIndexOffset:1000 - i}).bindPopup(function () { return popup(k); }).addTo(layer);
      pts.push([s.lat, s.lng]);
    });
    if (pts.length > 1) L.polyline(pts, {color:col, weight:2.5, opacity:.8, dashArray:"6 8"}).addTo(layer);
  }
  if (!pts.length) { map.setView([25.77, -80.25], 11); return; }
  if (pts.length === 1) map.flyTo(pts[0], 14, {duration:reduced ? 0 : .8});
  else map.flyToBounds(L.latLngBounds(pts), {padding:[56, 56], maxZoom:14, duration:reduced ? 0 : .8});
}
function focusStop(k) {
  if (!map) return;
  setTimeout(function () {
    if (!markers[k]) drawMap();
    var s = STOPS[k]; map.flyTo([s.lat, s.lng], 15, {duration:reduced ? 0 : .7});
    setTimeout(function () { if (markers[k]) markers[k].openPopup(); }, reduced ? 50 : 760);
  }, 120);
}

/* ================= Plan controls ================= */
function syncPlanUI() {
  $$(".seg[data-key]").forEach(function (g) {
    $$("button", g).forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.v === state[g.dataset.key]); });
  });
}
function planChanged(msg) {
  store("miami27-plan", state); syncPlanUI(); renderMoments(); select(sel, false); buildPrint();
  if (history.replaceState) history.replaceState(null, "", shareURL(location.hash.slice(1)));
  if (msg) toast(msg);
}
$$(".seg[data-key]").forEach(function (g) {
  $$("button", g).forEach(function (b) {
    b.addEventListener("click", function () {
      if (state[g.dataset.key] === b.dataset.v) return;
      state[g.dataset.key] = b.dataset.v;
      planChanged("Itinerary updated: " + summary());
    });
  });
});
function summary() {
  var a = {snorkel:"snorkeling Jan 2", zoo:"Zoo Miami Jan 2", cruise:"bay cruise Jan 2"}[state.adv];
  return a + ", city day Jan " + state.city + (state.wx === "wet" ? " (rain plan)" : "");
}

/* ================= Share ================= */
function shareURL(hash) {
  var u = new URL(location.href);
  u.search = ""; Object.keys(DEF).forEach(function (k) { if (state[k] !== DEF[k]) u.searchParams.set(k, state[k]); });
  u.hash = hash || "";
  return u.href;
}
function copyLink(url, msg) {
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(url).then(function () { toast(msg); }, function () { window.prompt("Copy this link:", url); });
  else window.prompt("Copy this link:", url);
}
function share() {
  var url = shareURL("");
  if (navigator.share) {
    navigator.share({title:"Miami, together", text:"Our family's eight days in Miami, Dec 31 – Jan 7.", url:url}).catch(function (e) { if (e && e.name !== "AbortError") copyLink(url, "Trip link copied"); });
  } else copyLink(url, "Trip link copied. Your plan choices are included.");
}
$$("[data-share]").forEach(function (b) { b.addEventListener("click", share); });

/* ================= Forecast ================= */
var FC = null;
function wxInfo(c) {
  if (c === 0) return ["sun","Clear"]; if (c <= 2) return ["partly","Partly cloudy"]; if (c === 3) return ["cloud","Cloudy"];
  if (c === 45 || c === 48) return ["fog","Fog"]; if (c >= 95) return ["storm","Storms"];
  if ((c >= 51 && c <= 67) || (c >= 80 && c <= 82)) return ["rain","Showers"]; return ["cloud","Mixed"];
}
function fmtDay(iso) { var p = iso.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString("en-US", {weekday:"short", month:"short", day:"numeric"}); }
function rowFor(iso) { return FC && FC.filter(function (r) { return r.t === iso; })[0]; }
function beachScore(r) { return r.hi - (r.rain || 0) * 0.15 - r.wind * 0.4; }
function renderForecast() {
  var trip = DATES.map(function (d) { return rowFor(d.iso); }).filter(Boolean), isTrip = trip.length > 0;
  var show = isTrip ? trip : FC.slice(0, 7);
  $("#fc-title").textContent = isTrip ? "Our trip forecast" : "Miami Beach this week";
  $("#fc-status").textContent = isTrip ? (trip.length === 8 ? "All eight days are in range. Beyond a week, treat it as a rough guide." : trip.length + " of 8 trip days in range; the rest fill in as we get closer.")
                                       : "Our days come into range about 16 days out, around Dec 16. Until then, here's Miami Beach right now.";
  $("#fc-days").innerHTML = show.map(function (r) {
    var w = wxInfo(r.code), rain = r.rain == null ? 0 : r.rain;
    return '<div class="fcd' + (isTrip ? " trip" : "") + '"><div class="dd">' + fmtDay(r.t) + '</div><div class="ic" title="' + w[1] + '">' + icon(w[0]) + '</div>' +
      '<div class="tt">' + Math.round(r.hi) + '° <small>' + Math.round(r.lo) + '°</small></div><div class="ex">' + w[1] + '<br>Wind ' + Math.round(r.wind) + ' kn · Rain ' + rain + '%</div>' +
      '<div class="bar"><i style="width:' + rain + '%"></i></div></div>';
  }).join("");
  var out = "", j2 = rowFor("2027-01-02");
  if (j2) {
    var w = j2.wind, v = w < 15 ? ["#2E9C8A","Snorkel day looks good","Max wind about " + Math.round(w) + " knots on Jan 2. Under 15 knots is usually calm enough."]
      : w <= 20 ? ["#D0A23A","Snorkel day is borderline","Max wind about " + Math.round(w) + " knots on Jan 2. Keep watching; the operator makes the final call."]
      : ["#C4502F","Snorkel day looks rough","Max wind about " + Math.round(w) + " knots on Jan 2. Consider Zoo Miami or the bay cruise before the 48-hour cutoff."];
    out += '<div class="verdict"><i class="lamp" style="background:' + v[0] + '"></i><div><b>' + v[1] + '</b><span>' + v[2] + '</span></div></div>';
  } else {
    out += '<div class="verdict"><i class="lamp" style="background:#CFC6B4"></i><div><b>Snorkel check for Jan 2</b><span>A go / borderline / rough rating from the wind forecast appears once Jan 2 is in range, around Dec 17.</span></div></div>';
  }
  var bd = ["2027-01-04","2027-01-05","2027-01-06"].map(rowFor);
  if (bd.every(Boolean)) {
    var worst = bd.slice().sort(function (a, b) { return beachScore(a) - beachScore(b); })[0];
    out += '<div class="verdict"><i class="lamp" style="background:#0F6E6E"></i><div><b>Beach-day tip</b><span>' + fmtDay(worst.t) + ' looks least like a beach day, so it\'s the best pick for our city day.</span></div></div>';
  }
  $("#fc-extra").innerHTML = out;
  var can = !!j2 || bd.every(Boolean);
  $("#auto-plan").disabled = !can;
  $("#auto-note").textContent = can ? "Picks the Jan 2 plan and city day from the live forecast." : "Available once our dates are in range, around Dec 16–17.";
}
$("#auto-plan").addEventListener("click", function () {
  if (!FC) return;
  var j2 = rowFor("2027-01-02");
  if (j2) { if (j2.wind < 15) state.adv = "snorkel"; else if (j2.wind > 20) state.adv = state.adv === "snorkel" ? "zoo" : state.adv; }
  var bd = ["2027-01-04","2027-01-05","2027-01-06"].map(rowFor);
  if (bd.every(Boolean)) {
    var worst = bd.slice().sort(function (a, b) { return beachScore(a) - beachScore(b); })[0];
    state.city = String(+worst.t.slice(-2));
    state.wx = (worst.rain || 0) >= 50 || wxInfo(worst.code)[0] === "rain" || wxInfo(worst.code)[0] === "storm" ? "wet" : "dry";
  }
  planChanged("Planned from the forecast: " + summary());
});
$("#auto-plan").disabled = true;
(function loadForecast() {
  if (!window.fetch) { $("#fc-status").textContent = "The live forecast isn't supported in this browser."; return; }
  fetch("https://api.open-meteo.com/v1/forecast?latitude=25.7737&longitude=-80.1338&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=fahrenheit&wind_speed_unit=kn&timezone=America%2FNew_York&forecast_days=16")
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (j) {
      var d = j.daily;
      FC = d.time.map(function (t, i) { return {t:t, code:d.weather_code[i], hi:d.temperature_2m_max[i], lo:d.temperature_2m_min[i], rain:d.precipitation_probability_max[i], wind:d.wind_speed_10m_max[i]}; });
      renderForecast();
    })
    .catch(function () { $("#fc-status").textContent = "The live forecast couldn't load right now. Try again later."; });
})();

/* ================= Planner ================= */
var ptabs = $$(".p-tabs [role=tab]");
function pselect(t, focus) {
  ptabs.forEach(function (x) { var on = x === t; x.setAttribute("aria-selected", on); x.tabIndex = on ? 0 : -1; $("#" + x.getAttribute("aria-controls")).hidden = !on; });
  if (focus) t.focus();
}
ptabs.forEach(function (t, i) {
  t.addEventListener("click", function () { pselect(t); });
  t.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { e.preventDefault(); pselect(ptabs[(i + 1) % ptabs.length], true); }
    if (e.key === "ArrowLeft") { e.preventDefault(); pselect(ptabs[(i + ptabs.length - 1) % ptabs.length], true); }
  });
});

var BOOKINGS = [
  {id:"springhill", n:"Doral hotel suite", url:"https://www.marriott.com/reservation/availabilitySearch.mi?propertyCode=MIAMS&isSearch=false&fromDate=12/31/2026&toDate=01/03/2027&numberOfRooms=1&numberOfAdults=2&childrenCount=2&childrenAges=10,13", d:"Dec 31 – Jan 3", w:"now", note:"2 queens + sofa bed. Free cancellation until 5:59 PM Dec 29."},
  {id:"biscayne", n:"Biscayne snorkel & island trip", url:"https://www.biscaynenationalparkinstitute.org/snorkel-and-island-visit-from-coconut-grove/", d:"Jan 2", w:"now", note:"Ages 8+. Refund or rebook up to 48 hours before; full refund if they cancel for weather."},
  {id:"car", n:"Rental car", url:"https://www.kayak.com/cars", d:"Dec 31 – Jan 3", w:"now", note:"Pick up and return at the MIA rental car center."},
  {id:"shark", n:"Shark Valley bikes or tram", url:"https://www.sharkvalleytramtours.com/", d:"Jan 1", w:"soon", note:"Go early; busiest 10 AM–3 PM."},
  {id:"vizcaya", n:"Vizcaya Museum & Gardens", url:"https://vizcaya.org/", d:"Jan 3", w:"soon", note:"Timed entry. Open 9:30 AM–4:30 PM."},
  {id:"wynwood", n:"Wynwood Walls", url:"https://thewynwoodwalls.com/admissions", d:"City day", w:"soon", note:"Free for kids 12 and under. Open 10:30 AM–6:30 PM."},
  {id:"bigbus", n:"Big Bus 24-hour ticket", url:"https://www.bigbustours.com/en/miami/miami-bus-tours", d:"City day", w:"soon", note:"South Beach stop at 555 Washington Ave, every 30 min, 9:20 AM–4:20 PM."},
  {id:"frost", n:"Frost Science Museum", url:"https://www.frostscience.org/", d:"City day", w:"soon", note:"Planetarium show reserved on arrival."},
  {id:"luminosa", n:"Luminosa at Jungle Island", sub:"Optional", url:"https://feverup.com/m/781881", d:"City day evening", w:"soon", note:"5:30 or 6 PM entry."},
  {id:"pass", n:"National Parks pass", url:"https://www.nps.gov/planyourvisit/passes.htm", d:"Jan 1", w:"day", note:"Digital pass on Recreation.gov before driving out. Covers Shark Valley entry."},
  {id:"airboat", n:"Coopertown airboat", url:null, d:"Jan 1", w:"day", note:"No reservation needed. Open 9 AM–5 PM."},
  {id:"zoo", n:"Zoo Miami", sub:"Plan B", url:"https://shop.zoomiami.org/mainstore", d:"Jan 2", w:"back", note:"Only if the snorkel trip is off. Cheaper online."}
];
var WIN = {now:["Book now","b-now"], soon:["1–3 weeks ahead","b-soon"], day:["On the day","b-day"], back:["Only if needed","b-back"]};
var booked = store("miami27-booked") || store("miami-ny-booked") || {};
var bkFilter = "all";
$("#bk").innerHTML = '<div class="bk-row hdr"><span></span><span>Item</span><span>For</span><span>When to book</span><span>Notes</span></div>' +
  BOOKINGS.map(function (b) {
    var name = b.url ? '<a href="' + b.url + '" target="_blank" rel="noopener">' + esc(b.n) + icon("ext") + '</a>' : '<span>' + esc(b.n) + '</span>';
    return '<div class="bk-row" data-id="' + b.id + '" data-w="' + b.w + '"><input type="checkbox" class="check" aria-label="Mark ' + esc(b.n) + ' as booked">' +
      '<div class="bk-name">' + name + (b.sub ? '<small>' + esc(b.sub) + '</small>' : '') + '</div><div class="bk-date">' + esc(b.d) + '</div>' +
      '<div class="bk-win"><span class="badge ' + WIN[b.w][1] + '">' + WIN[b.w][0] + '</span></div><div class="bk-note">' + esc(b.note) + '</div></div>';
  }).join("");
function bkUpdate() {
  var done = 0, total = 0;
  $$("#bk .bk-row[data-id]").forEach(function (r) {
    var on = !!booked[r.dataset.id];
    r.classList.toggle("done", on); $(".check", r).checked = on;
    if (r.dataset.w !== "back") { total++; if (on) done++; }
    r.classList.toggle("hide", !(bkFilter === "all" || (bkFilter === "todo" ? !on : r.dataset.w === bkFilter)));
  });
  $("#bk-count").textContent = done + " of " + total + " booked";
  $("#bk-count-tab").textContent = done + "/" + total;
  $("#bk-bar").style.width = (total ? done / total * 100 : 0) + "%";
}
$$("#bk .check").forEach(function (c) { c.addEventListener("change", function () { booked[c.closest(".bk-row").dataset.id] = c.checked; store("miami27-booked", booked); bkUpdate(); }); });
$$("#bk-filters button").forEach(function (b) { b.addEventListener("click", function () { bkFilter = b.dataset.f; $$("#bk-filters button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); }); bkUpdate(); }); });
bkUpdate();

var KEYDATES = [
  {due:"2026-11-30T23:59:00-05:00", label:"Late November", t:"Book the hotel, the snorkel trip and the car", m:"These three can sell out over the holidays."},
  {due:"2026-12-12T23:59:00-05:00", label:"Early December", t:"Book Shark Valley and Vizcaya", m:"Also check whether CityPlace Doral announces New Year's Eve fireworks."},
  {due:"2026-12-22T23:59:00-05:00", label:"Mid December", t:"Buy Wynwood, Big Bus and Frost tickets", m:"Plus Luminosa if we want it. Pick the city day first."},
  {due:"2026-12-29T17:59:00-05:00", label:"Dec 29, 5:59 PM", t:"Last free cancellation for the Doral hotel", m:"After this the stay is non-refundable."},
  {due:"2026-12-30T23:59:00-05:00", label:"Dec 29–30", t:"Check the marine forecast", m:"Use the snorkel check above, or the wind forecast for Biscayne Bay."},
  {due:"2026-12-31T09:00:00-05:00", label:"Dec 31, ~9 AM", t:"Final call on snorkeling", m:"The 48-hour refund window closes. Switch to Plan B if needed."},
  {due:"2027-01-01T08:00:00-05:00", label:"Jan 1, morning", t:"Buy the National Parks pass", m:"On Recreation.gov, before driving to Shark Valley."}
];
(function () {
  var now = new Date(), found = false;
  $("#kd").innerHTML = KEYDATES.map(function (k) {
    var due = new Date(k.due), cls = "", badge = "";
    if (due < now) { cls = "past"; badge = '<span class="badge b-back">Done</span>'; }
    else if (!found) { found = true; cls = "next"; badge = '<span class="badge b-now">Next up</span>'; }
    return '<li class="' + cls + '"><div class="kdate">' + esc(k.label) + badge + '</div><div class="ktxt">' + esc(k.t) + '</div><div class="kmore">' + esc(k.m) + '</div></li>';
  }).join("");
})();

var PACK = {
  "Beach & water":["Swimsuits (2 each)","Quick-dry towels","Reef-safe sunscreen","Rash guards or shorty wetsuit","Sandals or water shoes","Dry bag for phones"],
  "Everglades":["Hats & sunglasses","Bug spray","Refillable water bottles","Sneakers for biking"],
  "Clothes":["Light jacket each","Shorts & T-shirts","One nicer dinner outfit","Walking shoes"],
  "Documents & tech":["Photo ID","Driver's license + card","Hotel & ticket confirmations","Chargers & power bank","Any medicines"]
};
var packed = store("miami27-pack") || {};
function packRender() {
  var total = 0, done = 0, h = "";
  Object.keys(PACK).forEach(function (c) {
    h += "<h4>" + esc(c) + "</h4>";
    PACK[c].forEach(function (x) { var id = c + "|" + x; total++; if (packed[id]) done++; h += '<label><input type="checkbox" class="check" data-id="' + esc(id) + '"' + (packed[id] ? " checked" : "") + '><span>' + esc(x) + '</span></label>'; });
  });
  $("#pack").innerHTML = h;
  $$("#pack input").forEach(function (i) { i.addEventListener("change", function () { packed[i.dataset.id] = i.checked; store("miami27-pack", packed); packStats(); }); });
  packStats();
}
function packStats() {
  var all = $$("#pack input"), done = all.filter(function (i) { return i.checked; }).length, pct = all.length ? Math.round(done / all.length * 100) : 0;
  $("#pack-sub").textContent = done + " of " + all.length + " packed";
  $("#ring-txt").textContent = pct + "%";
  $("#ring-fg").style.strokeDashoffset = (169.6 * (1 - pct / 100)).toFixed(1);
}
$("#pack-reset").addEventListener("click", function () { packed = {}; store("miami27-pack", packed); packRender(); });
packRender();

/* ================= Print, credits ================= */
function buildPrint() {
  $("#print-all").innerHTML = "<h2>Our itinerary</h2>" + days().map(function (d, i) {
    return '<div class="pd-day"><strong>Day ' + (i + 1) + ' · ' + DATES[i].long + ': ' + esc(plain(d.title)) + '</strong><ul>' +
      d.blocks.map(function (b) { return "<li><b>" + esc(b.when) + "</b>: " + esc(b.what) + (b.txt ? ". " + esc(b.txt) : "") + "</li>"; }).join("") + "</ul></div>";
  }).join("");
}
$("#print-btn").addEventListener("click", function () { window.print(); });
var used = {coast:1, tower:1, frost:1, wynwood:1};
Object.keys(D).forEach(function (k) { used[D[k].photo] = 1; });
MOMENTS.forEach(function (m) { used[m.ph] = 1; });
Object.keys(STOPS).forEach(function (k) { if (STOPS[k].ph) used[STOPS[k].ph] = 1; });
$("#credits").innerHTML = Object.keys(PHOTOS).filter(function (k) { return used[k]; }).map(function (k) {
  var p = PHOTOS[k]; return '<li><a href="' + p.page + '" target="_blank" rel="noopener">' + esc(p.name) + '</a>: ' + esc(p.by) + ', ' + esc(p.lic) + '</li>';
}).join("");

/* ================= Start ================= */
syncPlanUI(); renderMoments(); buildPrint();
var hm = /^#day-([1-8])$/.exec(location.hash), start = 0;
if (hm) start = +hm[1] - 1; else DATES.forEach(function (d, i) { if (d.iso === todayISO) start = i; });
select(start, false);
if (hm) setTimeout(function () { $("#days").scrollIntoView(); }, 60);
})();
