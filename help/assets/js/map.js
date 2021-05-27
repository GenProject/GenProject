    var mymap;
    var markeropa;
    var catmarkers = [];
    var savearray = [];
    var teyvatarray = [
        'statue','teleport','succes','pano','anemo','geocul','agate','cordi','cdelic','cprec','cluxe','cdefi','cfee','ferblanc','argetoile','cristal',
        'electrocris','eclatcm','sceaugeo','lapis','jade','noyauc','perle','conque','ffeu','fbrume','gdloup','pomme','carotte',
        'radis','halampe','chrysantheme','lyscalla','tombaie','bacrochet','pissenlit','cecilia','qingxin','muguet','piment',
        'lysverni','fsoie','bambou','lotus','grenouille','lezard','papillon','luciole'];
    var nbtmark = 0;
    var langue, lgmenu;

// $(window).load(function(){

// Fonctions Interaction sur la Map

    function onMapClick(e) {
        console.log(langue["ui-click"] + mymap.wrapLatLng(e.latlng));
    }

    function onMarkerClick(e) {
        markeropa = this;
    }

    function checkinfo(e) {
        if (!localStorage.getItem('Mapvers') || !(localStorage.Mapvers === "4.0")) {
            localStorage.Mapvers = "4.0";
            if (localStorage.MapLng === "FR") {
                var infobox = lity('#infoFR');
            } else {
                var infobox = lity('#infoEN');
            }
        }
    }

// Fonctions de Gestion des Marqueurs

    function getLscbx (name) {
        lscbx = localStorage.getItem("chkbox" + name);
        if(!lscbx) {
            lscbx = [];
        } else {
            lscbx = JSON.parse(lscbx);
        }
        return lscbx;
    }

    function initarray() {
        catmarkers.forEach(function(e) {
            window[e+'array'] = getLscbx(e);
        });
    }

    function selectarray(mtype,mnumb,mstate) {
        array = window[mtype+'array'];
        if (mstate) {
            array.push(mnumb);
            markeropa.setOpacity(0.45);
        } else {
            array.splice((array.indexOf(""+mnumb)), 1);
            markeropa.setOpacity(1);
        }
        localStorage.setItem("chkbox" + mtype, JSON.stringify(array));
    };

    function activecb(mtype,mnumb) {
        cooktl = getLscbx(mtype);
        if (cooktl) {
            if (cooktl.indexOf(""+mnumb) >= 0)
                return true;
        };
        return false;
    };

    function resetmarkers() {
        doreset();
        alert(langue["ui-reset"]);
        return document.location.href = 'index.html';
    };

    function doreset () {
        catmarkers.forEach(function(e) {
            localStorage.removeItem("chkbox"+e);
        });
    };

    function savemarkers() {
        savearray = ["v2"];
        catmarkers.forEach(function(e){
            savearray.splice(savearray.length, 0, e, getLscbx(e));
        });
        return savearray;
    };

    function loadusermarkers(lstmrk) {
        if (lstmrk[0] == "v2") {
            doreset();
            var i = 1, cbx;
            while (lstmrk[i]) {
                cbx = "chkbox" + lstmrk[i];
                localStorage.setItem(cbx, JSON.stringify(lstmrk[i+1]));
                i = i + 2;
            };
            alert(langue["ui-import"]);
            return document.location.href = 'index.html';
        } else {
            alert(langue["ui-fileerror"]);
        };
    };

    function reselectmenu(){
        $('#menu a[data-type]').each(function(){
            if ($(this).hasClass('active')) {
                // $('.' + $(this).data('type')).show();
                mymap.addLayer(window[$(this).data('type') + 'Group']);
            }
        });
        $('.matbtn').each(function(){
            if ($(this).hasClass('active')) {
                // $('.' + $(this).data('type')).show();
                mymap.addLayer(window[$(this).data('type') + 'Group']);
            }
        });
        if (localStorage.MenumapgenshinLi) {
            var listatut = JSON.parse(localStorage.MenumapgenshinLi);
        } else {
            localStorage.MenumapgenshinLi = [];
        };
        if (localStorage.MenumapgenshinBtn) {
            var btnstatut = JSON.parse(localStorage.MenumapgenshinBtn);
        } else {
            localStorage.MenumapgenshinBtn = [];
        };

        if(listatut){
            listatut.forEach(function(element) {
                $("#btn" + lgmenu + element).addClass('active');
                // $('.' + element).show();
                mymap.addLayer(window[element + 'Group']);
            });
        };
        if (btnstatut){
            btnstatut.forEach(function(element) {
                $("#btn" + lgmenu + element).addClass('active').attr('src', "media/icones/" + element + "on.png");
                // $('.' + element).show();
                mymap.addLayer(window[element + 'Group']);
            });
        };

    };

    // $(function () {

// Initialisation et chargement de la Map

    mymap = L.map('mapid', {
        crs: L.CRS.Simple,
        minZoom : -3,
        maxZoom : 2
    });

    mymap.zoomControl.setPosition('topright')
    mymap.setMaxBounds(new L.latLngBounds([-1000,-1000], [7344,7344]));
    var bounds = [[0,0], [6144,6144]];
    var image = L.imageOverlay('media/map.jpg', bounds).addTo(mymap);
    mymap.fitBounds(bounds);

    teyvatarray.forEach(function(e){
        window[e+'Group'] = L.layerGroup();
    });


    // Affichage du Bouton Menu

var BoutonMenu = L.easyButton({
    states : [{
        stateName: 'close-menu',
        icon: '<img src="media/icones/menuoff.png">',
        title: langue["ui-close"],
        onClick: function(btn, mymap){
            $('body').toggleClass('show-menu');
            mymap.invalidateSize();
            btn.state('open-menu')
        }
    },{
        stateName: 'open-menu',
        icon: '<img src="media/icones/menuon.png">',
        title: langue["ui-open"],
        onClick: function(btn, mymap){
            $('body').toggleClass('show-menu');
            mymap.invalidateSize();
            btn.state('close-menu')
        }
    }]
});

BoutonMenu.addTo(mymap);

// Initialisation des marqueurs

    function loadmarker(marklist, markico, grp, marktitle, filename, cbxname) {
        var marq = [], nfichier, i, mtype, checkbox='', popup='', curmarker, txt="";
        var checkopa = getLscbx(cbxname);
        var lgrp = window[grp + 'Group'];
        if(typeof cbxname !== 'undefined') 
            catmarkers.push(cbxname);
        // console.log(JSON.stringify(catmarkers));
        for (i=0; i<marklist.length; i++) {
            marq = marklist[i];
            // console.log("mark n° "+ (i+1) + " " + JSON.stringify(marq)); // Pour Debug les marqueurs
            mtype = marq[0];
            nfichier = filename + (i+1);
            if(typeof cbxname !== 'undefined')
            checkbox = '<br><h2><label><input id="mapbox" name="'+cbxname+'" value="'+(i+1)+'" type="checkbox" /> '+langue['ui-found']+'</h2>';

            switch (mtype) {
                case 0 : // Img (txt+cb)
                    txt = (typeof marq[2] !=='undefined') ? "<br><h1>"+marq[2]+"</h1>" : "";
                    popup = '<a href="media/'+nfichier+'.jpg" data-lity><img class="thumb" src="media/'+nfichier+'.jpg"/></a>'+txt+checkbox;
                    break;
                case 3 : // Gif (txt+cb)
                    txt = (typeof marq[2] !=='undefined') ? "<br><h1>"+marq[2]+"</h1>" : "";
                    popup = '<a href="media/'+nfichier+'.gif" data-lity><img class="thumb" src="media/'+nfichier+'.gif"/></a>'+txt+checkbox;
                    break;
                case 5 : // Video (txt+cb)
                    txt = (typeof marq[3] !=='undefined') ? "<br><h1>"+marq[3]+"</h1>" : "";
                    popup = '<iframe width="560" height="315" src="//www.youtube.com/embed/'+marq[2]+'?rel=0" frameborder="0" allowfullscreen></iframe>'+txt+checkbox;
                    break;
                case 11 : // null (+cb)
                    popup = '<h1>'+marq[2]+checkbox+'</h1>';
                    break;
                case 12 : // sans popup
                    // Have a break, have a Kitkat
            };

            if(typeof cbxname !== 'undefined') {
                if (mtype == 11)  
                    curmarker = L.marker(marq[1], {icon: Null, title: ""}).on('click', onMarkerClick).bindPopup(popup, popupOptions);
                else {
                    if (mtype == 5)
                        titlem = (typeof marq[4] !=='undefined') ? marq[4] : marktitle;
                    else if (mtype == 0 || mtype == 3)
                        titlem = (typeof marq[3] !=='undefined') ? marq[3] : marktitle;
                    curmarker = L.marker(marq[1], {icon: markico, title: titlem, riseOnHover: true}).on('click', onMarkerClick).bindPopup(popup, popupOptions);
                }
            } else {
                if (mtype !== 12) {
                    curmarker = L.marker(marq[1], {icon: markico, title: marktitle, riseOnHover: true}).bindPopup(popup, popupOptions);
                } else {
                    curmarker = L.marker(marq[1], {icon: markico, title: marktitle});
                }
            };

            if(checkopa.indexOf(""+(i+1)) >= 0)
            curmarker.setOpacity(0.45);
            curmarker.addTo(lgrp);

        };
        console.log(marktitle + " : " + marklist.length + langue["ui-load"]);
        nbtmark += marklist.length;
        // console.log("nombre de marqueur Total chargés : " + nbtmark); // Pour debug
    };

    // Chargement des Marqueurs

        loadmarker(liststatue,Statue,"statue",langue.cat01,"statue");
        loadmarker(listteleport,Teleport,"teleport",langue.cat02,"tp");
        loadmarker(listsucces,Succes,"succes",langue.cat46,"succes","succes");
        loadmarker(listsuccesl,Succes,"succes",langue.cat46,"","succesl");
        loadmarker(listpano,Pano,"pano",langue.cat03,"pano","pano");
        loadmarker(listpanol,Pano,"pano",langue.cat03,"panol","panol");
        loadmarker(listanemo,Anemo,"anemo",langue.cat10,"anemo","anemo");
        loadmarker(listgeocul,Geocul,"geocul",langue.cat29,"geoc","geocul");
        loadmarker(listagate,Agate,"agate",langue.cat47,"agate","agate");
        loadmarker(listcordi,Cordi,"cordi",langue.cat04,"oc","cordi");
        loadmarker(listcordil,Cordi,"cordi",langue.cat04,"ocl","cordil");
        loadmarker(listcdelic,Cdelic,"cdelic",langue.cat05,"dc","cdelic");
        loadmarker(listcdelicl,Cdelic,"cdelic",langue.cat05,"dcl","cdelicl");
        loadmarker(listcprec,Cprec,"cprec",langue.cat06,"pc","cprec");
        loadmarker(listcprecl,Cprec,"cprec",langue.cat06,"pcl","cprecl");
        loadmarker(listcluxe,Cluxe,"cluxe",langue.cat07,"lc","cluxe");
        loadmarker(listcluxel,Cluxe,"cluxe",langue.cat07,"lcl","cluxel");
        loadmarker(listcdefi,Cdefi,"cdefi",langue.cat08,"defi","cdefi");
        loadmarker(listcdefil,Cdefi,"cdefi",langue.cat08,"defil","cdefil");
        loadmarker(listcfee,Cfee,"cfee",langue.cat09,"","cfee");
        loadmarker(listcfeel,Cfee,"cfee",langue.cat09,"","cfeel");
        loadmarker(listferblanc,Ferblanc,"ferblanc",langue.cat25);
        loadmarker(listargetoile,Argetoile,"argetoile",langue.cat48);
        loadmarker(listcristal,Cristal,"cristal",langue.cat11);
        loadmarker(listelectroc,Electrocris,"electrocris",langue.cat12);
        loadmarker(listeclatcm,Eclatcm,"eclatcm",langue.cat26);
        loadmarker(listsceaugeo,Sceaugeo,"sceaugeo",langue.cat30,"sg","sceaugeo");
        loadmarker(listlapis,Lapis,"lapis",langue.cat41);
        loadmarker(listjade,Jade,"jade",langue.cat39);
        loadmarker(listnoyauc,Noyauc,"noyauc",langue.cat44);
        loadmarker(listperle,Perle,"perle",langue.cat32);
        loadmarker(listconque,Conque,"conque",langue.cat40);
        loadmarker(listffeu,Ffeu,"ffeu",langue.cat14);
        loadmarker(listfbrume,Fbrume,"fbrume",langue.cat13);
        loadmarker(listgdloup,Gdloup,"gdloup",langue.cat45);
        loadmarker(listpomme,Pomme,"pomme",langue.cat15);
        loadmarker(listcarotte,Carotte,"carotte",langue.cat16);
        loadmarker(listradis,Radis,"radis",langue.cat17);
        loadmarker(listhalampe,Halampe,"halampe",langue.cat20);
        loadmarker(listchrysantheme,Chrysantheme,"chrysantheme",langue.cat21);
        loadmarker(listlyscalla,Lyscalla,"lyscalla",langue.cat22);
        loadmarker(listtombaie,Tombaie,"tombaie",langue.cat18);
        loadmarker(listbacrochet,Bacrochet,"bacrochet",langue.cat24);
        loadmarker(listpissenlit,Pissenlit,"pissenlit",langue.cat19);
        loadmarker(listcecilia,Cecilia,"cecilia",langue.cat23);
        loadmarker(listqingxin,Qingxin,"qingxin",langue.cat34);
        loadmarker(listmuguet,Muguet,"muguet",langue.cat35,"muguet");
        loadmarker(listpiment,Piment,"piment",langue.cat36);
        loadmarker(listlysverni,Lysverni,"lysverni",langue.cat37);
        loadmarker(listfsoie,Fsoie,"fsoie",langue.cat38);
        loadmarker(listbambou,Bambou,"bambou",langue.cat31);
        loadmarker(listlotus,Lotus,"lotus",langue.cat33);
        loadmarker(listgrenouille,Grenouille,"grenouille",langue.cat27);
        loadmarker(listlezard,Lezard,"lezard",langue.cat28);
        loadmarker(listpapillon,Papillon,"papillon",langue.cat42);
        loadmarker(listluciole,Luciole,"luciole",langue.cat43);

    $('#total' + lgmenu).text(nbtmark + langue['ui-load']);

// Fonctions Interaction Map

    mymap.on("click", onMapClick);

    mymap.on('popupopen', function () {
        $(":checkbox").on("change", function(){
            var checkboxtype = this.name;
            var checkboxnumber = this.value;
            var checkboxstate = this.checked;
            selectarray (checkboxtype, checkboxnumber, checkboxstate);
        });
        if(document.getElementById("mapbox")){
            var checkboxtype = document.getElementById("mapbox").name;
            var checkboxnumber = document.getElementById("mapbox").value;
            var checkboxstate = activecb(checkboxtype,checkboxnumber);
            $("#mapbox").prop('checked', checkboxstate);
        };
    });

// Gestion du Menu

    $('#menu a[data-type]').on('click', function(e){
        e.preventDefault();
  
        var type = $(this).data('type');
        $(this).toggleClass('active');
        if($(this).hasClass('active')) {
            mymap.addLayer(window[type+'Group']);
        } else {
            mymap.removeLayer(window[type+'Group']);
        };

        var listatut = [];
        $('#menu a[data-type]').each(function(){
            if ($(this).hasClass('active') && (listatut.indexOf($(this).data('type')) < 0)) {
                listatut.push($(this).data('type'));
            };
        });
        localStorage.MenumapgenshinLi = JSON.stringify(listatut);
    });

    $('.matbtn').on('click', function() {
        var ndf = $(this).data('type');
        if (!($(this).hasClass('active'))) {
            $(this).attr('src', "media/icones/" + ndf + "on.png");
            $(this).toggleClass('active');
            mymap.addLayer(window[ndf+'Group']);
        } else {
            $(this).attr('src', "media/icones/" + ndf + "off.png");
            $(this).toggleClass('active');
            mymap.removeLayer(window[ndf+'Group']);
        };

        var btnstatut = [];
        $('.matbtn').each(function(){
            if ($(this).hasClass('active') && (btnstatut.indexOf($(this).data('type')) < 0)) {
                btnstatut.push($(this).data('type'));
            };
        });
        localStorage.MenumapgenshinBtn = JSON.stringify(btnstatut);
    });

// Gestion des Boutons Menu Haut

    $('.btninfo').on('click', function(){
        if (localStorage.MapLng === "FR") {
            var infobox = lity('#infoFR');
        } else {
            var infobox = lity('#infoEN');
        }
    });

    $('.btnreset').on('click', function() {
        if (confirm(langue["ui-prereset"])) {
            resetmarkers()
        }
    });

    $('.btnlg').on('click', function() {
        if (localStorage.MapLng === "FR") {
            localStorage.MapLng = "EN";
        } else {
            localStorage.MapLng = "FR";
        };
        document.location.href='index.html';
    });

    $('.btnsave').on('click', function() {
        this.href=URL.createObjectURL(new Blob([JSON.stringify(savemarkers())]));
        alert(langue["ui-export"]);
    });

    $('.btnload').on('click', function (e) {
        var fileElem = document.getElementById("ImportBox");
        if (fileElem) {
            fileElem.click();
        }
        e.preventDefault();
    });

    $('#ImportBox').on('change', function(ev_) {
        var fr_;
        (fr_=new FileReader()).onload=function(ev_) {
            loadusermarkers(JSON.parse(this.result));
        };
        fr_.readAsText(this.files[0]);
    });

    // }); // Fin Fonction globale

    initarray();
    reselectmenu();
    checkinfo();

// }); // Fin Windows load
