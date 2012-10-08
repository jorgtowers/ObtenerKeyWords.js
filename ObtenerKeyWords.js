function ObtenerKeyWords(idCampoTexto,idCampoResultado){
	//Variable Global
	var _InicioPalabra = "a";
	var _KeyWordsAObtener=5;
	var _OmitirSiguientePalabras=[	"a","b","c","d","e","f","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z",
									"esta","este","cual","como","para","pero","que","por",
									"uno","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez",
									"lunes","martes","miercoles","jueves","viernes","sabado","domingo",
									"enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre",									
									"yo","tu","el","nosotros","vosotros","ellos","ellas",
									"la","le","li","lo","lu","si","no",
									",", ";", "?", ".", "$", " ","#"];
	var _CambiarCaracteresOriginales="√¿¡ƒ¬»…À ÃÕœŒ“”÷‘Ÿ⁄‹€„‡·‰‚ËÈÎÍÏÌÔÓÚÛˆÙ˘˙¸˚—Ò«Á";
	var _CambiarCaracteresReemplazo="AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc";
	//Metodos
	this.KeyWordsAObtener=function(cantidad){
		if(cantidad.toString()!="")
			_KeyWordsAObtener=cantidad;
	}
	this.OmitirSiguientePalabras=function(palabrasAOmitir)	{		
		if(palabrasAOmitir.toString()!="")
			_OmitirSiguientePalabras=palabrasAOmitir;
	}	
	this.Sustituir={
		EstosCaracteres:function(caracterOriginal){
			if(caracterOriginal.toString()!="")				
				_CambiarCaracteresOriginales=caracterOriginal;
		},
		PorEstosCaracteres:function(caracterASustituir){
				if(caracterASustituir.toString()!="")					
				_CambiarCaracteresReemplazo=caracterASustituir;
		},
		Aplicar:function(cadena){
			if(cadena.toString()!="")
			{
				var mapping = {}; 
				for(var i = 0, j = _CambiarCaracteresOriginales.length; i < j; i++ )
					mapping[ _CambiarCaracteresOriginales.charAt( i ) ] = _CambiarCaracteresReemplazo.charAt( i );
				var ret = [];
				for( var i = 0, j = cadena.length; i < j; i++ ) {
					var c = cadena.charAt( i );
					if( mapping.hasOwnProperty( cadena.charAt( i ) ) )
						ret.push( mapping[ c ] );
					else
						ret.push( c );
				}
				return ret.join( '' );				
			}
		}
		
	}
	this.RemoverPalabrasOmitidas=function (palabraAOmitir) {  
		if(palabraAOmitir.toString()!="")
		{
			var flag = 0;  
			for (var i = 0; i < _OmitirSiguientePalabras.length; i++) {  
				if (_OmitirSiguientePalabras[i].toLowerCase() == palabraAOmitir.toLowerCase()) {  
					flag = 1;  
				}  
				if (palabraAOmitir == " " || palabraAOmitir == "") {  
					flag = 1;  
				}  
			}  
			if (flag == 0) {  
				_InicioPalabra = _InicioPalabra + " " + palabraAOmitir;  
			}  
		}
	}  
	
	//Propiedades
	Texto=document.getElementById(idCampoTexto);
	Salida=document.getElementById(idCampoResultado);
	this.KeyWords="";
	
	
	//Proceso de KeyWords
	this.Procesar=function(){
		if(Texto!=null && Texto.value=="")
			alert("Por favor ingrese texto en el campo para poder Obtener los KeyWords");
		else
		{
			_InicioPalabra="a";
			KeyWordsEncontrados = new Array(_KeyWordsAObtener);
			KeyWordsEncontradosFuerza = new Array(_KeyWordsAObtener);		
			for(a=0;a<_KeyWordsAObtener;a++)
			{
				KeyWordsEncontrados[a]="";
				KeyWordsEncontradosFuerza[a]=0;
			}
			var txt = this.Sustituir.Aplicar(Texto.value.replace(/[0-9]/g,'')).replace(/[^a-zA-Z]/g,' ').split(' ');	
			var palabras = new Array();  
			totalPalabras=txt.length;  	
			for(i=0; i<totalPalabras; i++) 
				this.RemoverPalabrasOmitidas(txt[i]);  
			txt = _InicioPalabra.replace(/[^a-zA-Z0-9]/g,' ').split(' ');  
			totalPalabras=txt.length;    
			for (i=0; i<totalPalabras; i++) {  
				if (!txt[i])  
					continue;  
				if (palabras[txt[i]] == null)  
					palabras[txt[i]]=0;  
				palabras[txt[i]]++;  
			}  
			salida = new Array();        
			var palabrasPorIntervalo=Math.round(totalPalabras/_KeyWordsAObtener)
			for (palabra in palabras) {  
				salida[salida.length]= palabra +":" +palabras[palabra] + " Fuerza: " + Math.round((palabras[palabra]/totalPalabras)*100) +"%";    			
				var w = Math.round((palabras[palabra]/totalPalabras)*100);  
				if(!isNaN(w)) {  
					var isMayor=false;
					i=0;
					while (i<_KeyWordsAObtener)
					{
						for(a=i;a<_KeyWordsAObtener;a++)
						{			
							if(w>KeyWordsEncontradosFuerza[a])						
								isMayor=true;						
							else
							{
								isMayor=false;
								break;				
							}
						}				
						if(isMayor)
						{
							KeyWordsEncontradosFuerza[i]=w;
							KeyWordsEncontrados[i]=palabra;
							isMayor=false;
							break;
						}					
						i++;
					}		
				
				}    
		   }  	
			keyWords=KeyWordsEncontrados.toString().replace(/,/g,', ');		   
			this.KeyWords=keyWords;
			if(Salida.value=="")
				Salida.value=keyWords;				
			else
			{
				if(confirm("øYa existen estos KeyWords: ("+Salida.value.toUpperCase()+"), desea Reemplazarlos por estos: ("+keyWords.toUpperCase()+")"))
				{
					Salida.value=keyWords;
					Salida.focus();
				}
				else
					Salida.focus();
			}
		}
	}
}
