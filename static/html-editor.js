(function() {
    var STORAGE_KEY = 'pagespace-html';

    angular.module('htmlApp', [ 'ui.codemirror' ])
    .controller('HtmlController' , function($scope) {

        $scope.changed = false;

        $scope.editorOpts = {
            mode: 'xml'
        };

        $scope.data = {
            html: '',
            file: '',
            url: ''
        };

        localforage.getItem(STORAGE_KEY).then(function(htmlDraftData) {
            return htmlDraftData ? new Promise(function(resolve) {
                resolve(htmlDraftData);
            }) : pagespace.getData();
        }).then(function(data) {
            $scope.data = data;
            $scope.$apply();
        });

        $scope.save = function() {
            return pagespace.setData($scope.data).then(function() {
                //remove draft
                return localforage.removeItem(STORAGE_KEY);
            }).then(function() {
                pagespace.close();
            });
        };

        $scope.saveDraft = function() {
            return localforage.setItem(STORAGE_KEY, $scope.data);
        };

         function saveOnChange() {
             setTimeout(function() {
                 if($scope.changed) {
                     $scope.saveDraft().then(function() {
                         console.info('Draft saved');
                         $scope.changed = false;
                         saveOnChange();
                     }).catch(function(err) {
                         console.error(err, 'Error saving draft');
                     });
                 } else {
                     saveOnChange();
                 }
             }, 500);
         }
         saveOnChange();
    });
})();