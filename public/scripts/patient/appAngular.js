
angular.module('appPatient', ['ui.router', 'ngTable'])

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('centros', {
                //url: '/centros',
                templateUrl: 'views/paciente/centros.html',
                controller: 'ctrlCentros'
            })
            .state('datos', {
                //url: '/datos',
                templateUrl: 'views/paciente/datos.html',
                controller: 'ctrlDatos'
            })
            .state('examenes', {
                //url: '/examenes',
                templateUrl: 'views/paciente/examenes.html',
                controller: 'ctrlExamenes'
            });

        $urlRouterProvider.otherwise(function($injector) {
            var $state = $injector.get('$state');
            $state.go('centros');
        });
    })
    .factory('comun', function($http) {
        var comun = {};

        comun.centros_med = [];
        comun.datos = {};

        nuevosDatos = {};
        comun.actual = {};
        /***Sección de métodos remotos***/

        comun.getCentros = function(){
            return $http.get('/centrosMed')
            .success(function(data){
                angular.copy(data, comun.centros_med)
                return comun.centros_med
            })
        }

        comun.getDatos = function(){
            return $http.get('/paciente/datos')
            .success(function(data){
                angular.copy(data, comun.datos)
                return comun.datos
            })
        }
  
        comun.updateDatos = function(datos){
            return $http.put('/paciente/datos/', {
                nombre : datos.nombre,
                apellido : datos.apellido,
                cedula : datos.cedula,
                direccion : datos.direccion,
                telefono : datos.telefono
            })
            .success(function(data){
                Materialize.toast("Datos Actualizados", 3000, 'rounded teal');
            })
        }

        return comun;
    })
    .controller('ctrlDatos', function($scope, $state, comun) {
        
        comun.getDatos();
        $scope.datos = comun.datos;
        //$scope.nuevos = comun.nuevosDatos;        
        //console.log($scope.datos);

        $scope.actualizar = function() {
           comun.updateDatos($scope.datos);
           $state.go('centros');            
        }
        $scope.regresar = function() {
            comun.getDatos();
            $scope.datos = comun.datos;
            $state.go('centros');    
        }


    })
    .controller('ctrlExamenes', function($http, $scope, $state, comun) {
        comun.getDatos();
        $scope.datos = comun.datos;
        $scope.examenes = [];
        $scope.actual = {};

        $http.get("/paciente/examenes")
            .then(function (response) {
                $scope.examenes = response.data;
            }
        );

        $('.collapsible').collapsible({
            accordion : false
        });

        $scope.verResultados = function(examen){
            $('#modalRes').openModal();
            $scope.actual = examen;
            
        }

        $scope.fecha = function(examen){
            var f = new Date(examen._muestra.fecha);
            return f.toDateString();
        }

        $scope.cargarResultados = function(examen){
            var body = [
                [ 
                    { 
                        text: 'Parametro', style: 'subItem' 
                    }, { 
                        text: 'Unidades', style: 'subItem' 
                    }, { 
                        text: 'Resultado', style: 'subItem' 
                    }, { 
                        text: 'Valores/referencia', style: 'subItem' 
                    } 
                ]
            ]

            angular.forEach(examen.resultados, function(resultado){
                body.push(
                    [
                        {text: 
                            (function(){
                                if (resultado.parametro) { return resultado.parametro;}
                                return "";
                            })()

                        },{text: 
                            (function(){
                                if (resultado.unidades) { return resultado.unidades;}
                                return "";
                            })()

                        },{text: 
                            (function(){
                                if (resultado.resultado) { return resultado.resultado;}
                                return "";
                            })()

                        },{text: 
                            (function(){ 
                                if (resultado.valores_referencia) { return resultado.valores_referencia;}
                                return "";
                            })()
                        }
                    ]
                );
            });

            return body;
        }

        $scope.pdf = function(examen){
             var examen = {
                content: [

                    {  text: "Salud Primero", style: 'header' },
                    {  text: "Reporte de examen medico: " + " " + examen.nombre + "\n\n", style: 'subheader' },
                    {
                        text: [
                            {
                                text: "Paciente: ", 
                                style: 'subItem'
                            }, $scope.datos.nombre + " " + $scope.datos.apellido
                        ]
                    },
                    {
                        text: [
                            {
                                text: "Fecha: ", 
                                style: 'subItem'
                            }, {
                                text: $scope.fecha(examen) + "\n\n"
                            }
                        ]
                    },
                    {
                        columns : [
                            { width: '*', text: ''},
                            {
                                width: 'auto',
                                table: {
                                    widths: [ '*', '*', '*', '*' ],
                                    body: $scope.cargarResultados(examen)
                                  }   
                            },
                            { width: '*', text: ''}
                        ]
                    }
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        bold: true,
                        alignment: 'center',
                        color: 'blue'
                    },
                    subheader: {
                        fontSize: 14,
                        bold: true,
                        alignment: 'center',
                        color: 'blue'
                    },
                    subItem: {
                        bold: true,
                        color: 'blue'
                    },
                    tableHeader: {
                        bold: true,
                        fontSize: 13,
                        color: 'black'
                    }
                }
            };

            pdfMake.createPdf(examen).open();

        }

        
    })
    .controller('ctrlCentros', function($scope, $state, comun, $sce) {
        comun.getCentros();
        $scope.centros = comun.centros_med;
        $scope.actual = {};

        $scope.setUrl = function (centro) {
          return $sce.trustAsResourceUrl(centro.coordenadas.latitud);
        }

        $scope.procesar = function(actual) {
            $('#modalInfo').openModal();             
            comun.actual = actual;
            $scope.actual = comun.actual;          
        }

        $(document).ready(function(){
            $('.carousel').carousel();
        });

        //boton cerrar de Informacion de Centro Med
        $scope.cerrarMod = function(){
            $('#modalInfo').closeModal();
            //$state.reload();
        }
        //$('.carousel.carousel-slider').carousel({full_width: true});
              

    })