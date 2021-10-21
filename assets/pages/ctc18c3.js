var base_url=function(url){
    var base=$("#base_url").val();
    return base+url;
}
$lang={};
$storage={};
$key_searching={};
$("#switch-lang").on("change",function(){
	var val=$(this).val();
	location.href=base_url('switching/lang/'+val);
})
$active_lang=$("#switch-lang :selected").val();
$("[name='switch-template']").on("change",function(){
  var value=$(this).val();
  http_request('switching/template/'+value,'POST',{})
  .done(function(result){
      window.location.reload();
  })  
})
var currentDate = function(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //As January is 0.
    var yyyy = today.getFullYear();
    if(dd<10) dd='0'+dd;
    if(mm<10) mm='0'+mm;
    return yyyy+"-"+mm+"-"+dd;
};
var DataTableLanguage=function(){
    if(typeof $active_lang=='undefined') $active_lang='english';
    return {"url":base_url('assets/plugins/datatables/languages/'+$active_lang+'.json')};
}
$('.fc-datepicker').datepicker({
	changeMonth: true,
	changeYear: true,
    showOtherMonths: true,
    selectOtherMonths: true,
    dateFormat: 'yy-mm-dd',
    yearRange: '1960:c+1'
});
$(".form-control-file button").on("click",function(){
	$(this).parent().find('input[type="file"]').trigger("click");
})
$(".form-control-file input[type='file']").on("change",function(){
	var filename=$(this).val();
	var spanFilename=$(this).parent().find(".filename");
	if(spanFilename.length>0){ spanFilename.html(filename); }else{ $(this).parent().append('<span class="filename">'+filename+'</span>');}
})
/* CONTROL ADD POSITION IN POPOVER */
    /* TOOLTIP CONTROL */
$('[data-toggle="tooltip"]').tooltip();
// colored tooltip
$('[data-toggle="tooltip-primary"]').tooltip({
  template: '<div class="tooltip tooltip-primary" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
});

$('[data-toggle="tooltip-secondary"]').tooltip({
  template: '<div class="tooltip tooltip-secondary" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>'
});
/* END TOOLTIP */
/* POPOVER */
$('[data-toggle="popover"]').popover();
$('[data-popover-color="head-primary"]').popover({
  template: '<div class="popover popover-head-primary" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
});

$('[data-popover-color="head-secondary"]').popover({
  template: '<div class="popover popover-head-secondary" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
});

$('[data-popover-color="primary"]').popover({
  template: '<div class="popover popover-primary" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
});

$('[data-popover-color="secondary"]').popover({
  template: '<div class="popover popover-secondary" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
});
$(".popover-single-form").each(function(){
    var elemid=$(this).data('id');
    var placeholder=$(this).data('placeholder');
    var width=$(this).data('width');
    placeholder=(typeof placeholder!='undefined' && placeholder!='') ? placeholder : elemid;
    $(this).popover({
        title: this.title,
        content: '<div class="input-group popover-body-form"><input type="text" class="form-control input-sm popover-form global-save" data-id="'+elemid+'" value="" placeholder="'+placeholder+'"><span class="input-group-text pointer inline-save-icon"><i class="fa fa-save"></i></span></div>',
        html: true,
        container: 'body',
        backdrop: true,
        placement: 'bottom',
        template: '<div class="popover popover-head-primary" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'    
    })
    .on("shown.bs.popover",function(){
        var popvid=$(this).attr('aria-describedby');
        $("#"+popvid).find(".popover-body").find('input:text').focus().val('');
        $("#"+popvid).find(".popover-header").append('<i class="pull-right fa fa-times tex-disabled pointer"></i>');
        if(typeof width!='undefined'){
            $("#"+popvid).find(".popover-body").css({'width':width});
            $("#"+popvid).find(".popover-header").css({'width':width});
        }
    })
})
$select2_options_disabled={};
// auto searching select2 if any
$(".search-select2-common").each(function(){
    var dataid=$(this).data('id');
    $select2_options_disabled[dataid]=[];
    if(typeof dataid=='undefined'){
        console.log('Missing attribute data-id in element search-select2-common'); 
        return false;
    }
    var ph=$(this).attr('placeholder');
    var multi=$(this).attr('multiple');
    var multiple=(typeof multi!='undefined') ? true : false;
    $(this).select2({
        minimumInputLength: 0,
        allowClear: true, 
        multiple: multiple,
        placeholder: ph,
        //width: (typeof width!='undefined') ? width : '100%',
        ajax: {
            url: base_url('common-control/simple-search-select2/'+dataid),
            headers: {
                'x-user-agent': 'ctc-webapi'
            },
            data: function(params) {
                return {
                    search: params.term
                }
            },
            processResults: function(data){
                var results=[];
                var any_disabled=(typeof $select2_options_disabled[dataid]!='undefined') ? true : false;
                $.each(JSON.parse(data),function(index,item){
                    var disabled=(any_disabled && $select2_options_disabled[dataid].indexOf(item.id)>-1) ? true : false;
                    results.push({id: item.id,text: item.text, disabled: disabled});
                })
                return {results: results};
            }
        }
    });    
})
function capitalize(str) {
  strVal = '';
  str = str.split(' ');
  for (var chr = 0; chr < str.length; chr++) {
    strVal += str[chr].substring(0, 1).toUpperCase() + str[chr].substring(1, str[chr].length) + ' '
  }
  return strVal
}
$(document)
.ready(function(){
    $(".auto-focus").focus();
})
.on("keypress","input[type='text'].popover-form.global-save",function(e){
    if(e.which==13){
        var keyid=$(this).data('id');    
        var keyval=$(this).val();
        http_request('common-control/inline-insert','POST',{keyid: keyid,keyval: keyval})
        .done(function(res){
            Msg.success(res.message);
            $("body").trigger('clik');
        })
    }
}).on("click",".inline-save-icon",function(){
    $(this).parent().find('input:text').trigger({type: 'keypress',which: 13});
})
.on("keyup","input[type!='file']",function(e){
    if(e.keyCode!=13)
        $(".alert-message").slideUp('slow');
})
.on("change","input:file",function(){
    $(".alert-message").slideUp('slow');
})
.on("click",".input-group .input-group-append",function(){
    if($(this).find('.fa-save').length>0){
        $(this).parent().find('input').trigger({type: 'keypress', which: 13});
    }
})
.on("keyup",".regex-word-space",function(){
    var value=$(this).val();
    var regExp=/^[A-Za-z ]+$/;
    if(!regExp.test(value)){
        $(this).val(value.slice(0,-1));
    }
})
.on("keyup",".regex-word",function(){
    var value=$(this).val();
    var regExp=/^[A-Za-z]+$/;
    if(!regExp.test(value)){
        $(this).val(value.slice(0,-1));
    }
})
.on("keyup",".regex-number",function(){
    var value=$(this).val();
    var regExp=/^[0-9.]+$/;
    if(!regExp.test(value)){
        $(this).val(value.slice(0,-1));
    }
})
.on("keyup",".regex-currency",function(){
    var value=$(this).val();
    var regExp=/^[0-9.,]+$/;
    if(!regExp.test(value)){
        $(this).val(value.slice(0,-1));
    }
})
.on("blur",".regex-email",function(){
    var value=$(this).val();
    var regExp=/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    if(value!="" && !regExp.test(value.toLowerCase())){
        var $closest=$(this).closest('.form-group');
        var error="<i class='pull-right error-inline email'>"+$lang.msg_error_invalid_email+"</i>";
        $closest.find('label.form-label').append($(error));
        $(this).addClass('border-red');
    }
})
.on("keyup",".regex-email",function(){
    var $closest=$(this).closest('.form-group');
    $closest.find('label.form-label .error-inline.email').remove();
    $(this).removeClass('border-red');
})
.on("click",".value_same",function(){
    $that=$(this);
    var src=$that.data('src');
    var dst=$that.data('dst');
    setTimeout(function(){
        if($that.is(":checked")){
            $("[name='"+dst+"']").val($("[name='"+src+"']").val());
        }
    },100)
})

$("html").on("mouseup", function (e) {
    var l = $(e.target);
    var className=l[0].className;
    if(typeof className!='undefined' && className!='' && className!=null && className.indexOf('popover')>-1){
    //if (l.length!=0 && typeof l[0].className!='undefined' && l[0].className!=null && l[0].className!='' && l[0].className.indexOf("popover") == -1 && l.parent().parent().parent().attr('class').indexOf('popover')==-1) {
        $(".popover").each(function () {
            $(this).popover("hide");
        });
    }
})
$('.form-control').keydown(function (e) {
     if (e.which === 13) {
         if($(this).is(".prevent_next_focus")){}else{
         var index = $('.form-control').index(this) + 1;
         if(!$(this).is("textarea")){
             $('.form-control').eq(index).focus();
         }}
     }
 });
var getToken=function(){
    return localStorage.getItem('CTC-ACCESS-KEY');
}
var http_request = function(url, method, data, onError, setfocus){
    if(data.loading==true) loading_show(".content");
    return $.ajax({
            url: base_url(url),
            type: method,
            headers: {
                'x-user-agent': 'ctc-webapi',
                'x-access-token': getToken(),
                'x-domain': base_url(''),
            },
            async: false,
            dataType: 'JSON',
            crossDomain: true,
            data: (typeof data != 'undefined') ? data : {},
        })
        .fail(function(err){
            var res = err.responseJSON;
            if (typeof onError == 'object') {
                var error_description=res.error || res.message || res.description;
                Msg.error(error_description);
                if (onError.return) {
                    return onError.return;
                }
            } else
            if (typeof onError != 'undefined' && onError.toLowerCase() == 'playsound') {
                aud.play();
                //alert(res.description);
                aud.pause();
                aud.currentTime = 0.0;
            } else
            if (typeof onError != 'undefined' && onError.toLowerCase().indexOf('inline') > -1) {
                var inID = onError.split("#");
                //inlineAlert('error', "#" + inID[1], res.description);
            } else
            if (typeof onError != 'undefined' && onError == 'reset') {
                Msg.error(res.error);
                $("#reset").click();
            } else
            if (typeof res != 'undefined') {
                Msg.error(res.error);
            } else 
            if(err.status==404){
                Msg.error('Error! Address not found!');
                //Msg.error("<strong>System Error! </strong> Response OK but invalid JSON Format.<br>Please contact system developer");
            }else
            if(err.status==200){
                Msg.error('<strong>Error! </strong> It seems response not in json format');
            }else{
                Msg.error('<strong>Error!</strong> '+err.responseText);
            }
            if (setfocus != '') {
                $(setfocus).focus().select();
            }
        })
        .always(function(){
            if(data.loading==true) loading_hide();
        });

}
var loading_show=function(idtarget){
    if (typeof idtarget == 'undefined') {
        var idtarget = ".content";
    }
    if ($(idtarget).length == 0) idtarget = "body div";
    $("body").css({ opacity: 0.5 });
    $("#loader").removeClass('hide');
    var objectWidth = $("#loader").width();
    var objectHeight = $("#loader").height();
    var WindowHeight = $(window).height();
    var targetWidth = $(idtarget).width();
    var targetHeight = $(idtarget).height();
    if (targetHeight > WindowHeight) {
        targetHeight = WindowHeight;
    }

    $("#loader").css({
        'top': (targetHeight / 2) - (objectHeight / 2),
        'left': $(idtarget).offset().left + (targetWidth / 2) - (objectWidth / 2),
        'z-index': 5000
    });
}

var loading_hide=function(){
    $("body").css({ opacity: 1 });
    if ($("#loader").length) {
        $("#loader").addClass('hide');
        $("#loader .addText").remove();
    }
}
var Msg={
    success: function(message,className){
        var className=(className) ? className : 'alert-success';
        Msg.callAlert(message,className);
    },
    info: function(message,className){
        var className=(className) ? className : 'alert-info';
        Msg.callAlert(message,className);
    },
    warning: function(message,className){
        var className=(className) ? className : 'alert-warning';
        Msg.callAlert(message,className);
    },
    error: function(message,className){
        var className=(className) ? className : 'alert-danger';
        Msg.callAlert(message,className);
    },
    callAlert: function(message,className){
        var elem=''
        +'<div class="alert-message alert '+className+'" role="alert">'
            +'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
                +'<span aria-hidden="true">×</span>'
            +'</button>'
            +message
        +'</div>';
        $(".alert-message").remove();
        $("body").append($(elem));
        var elemwidth=$(".alert-message").width();
        $(".alert-message").animate({
            'margin-left': -(elemwidth/2)+'px'
            },
            500, function() {
        });
        setTimeout(function(){
          $(".alert-message").slideUp('swing');
        },5000)
    }
}
var hideMsg=function(){
    $(".alert-message").remove();
}
var getActiveLang=function(controller){
    if(typeof controller=='undefined'){ 'Missing controller name in getActiveLang()';return false };
    $.ajax({
        url: base_url(controller+'/get-active-lang'),
        type: 'GET',
        dataType: 'json',
        data: {},
    })
    .done(function(data) {
        $lang=data;
    })
}
var store={
    set:function(name,id){
        if(typeof $storage[name]=='undefined')
            $storage[name]=[];
        $storage[name].push(id);
        $select2_options_disabled[name.replace('sl_','')].push(id);
        sessionStorage.setItem(name,JSON.stringify($storage[name]));
    },
    get: function(name){
        var dt=sessionStorage.getItem(name);
        return JSON.parse(dt);
    },
    reload: function(name){
        var dt=sessionStorage.getItem(name);
        if(dt!=null){
            var parse=_.uniq(JSON.parse(dt));
            $storage[name]=parse; 
            $select2_options_disabled[name.replace('sl_','')]=parse;
            return parse; 
        }else{
            return [];
        }
    },
    delete: function(name,id){
        var parse=_.uniq($storage[name]);
        var active_length=parse.length;
        var index=parse.indexOf(id);
        if(index>-1){
          parse.splice(index,1);
          parse=_.uniq(_.compact(parse));
          var current_length=parse.length;
            $storage[name]=parse; 
            $select2_options_disabled[name.replace('sl_','')]=parse;
            sessionStorage.setItem(name,JSON.stringify(parse));
            if(current_length<active_length) return true;
            return false;
        }         
    },
    clear: function(name){
        $storage[name]=[]; 
        sessionStorage.removeItem(name);
        $select2_options_disabled[name.replace('sl_','')]=[];

    }
}
if(typeof $.fn.dataTableExt!='undefined'){
    $.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings) {
        return {
            "iStart": oSettings._iDisplayStart,
            "iEnd": oSettings.fnDisplayEnd(),
            "iLength": oSettings._iDisplayLength,
            "iTotal": oSettings.fnRecordsTotal(),
            "iFilteredTotal": oSettings.fnRecordsDisplay(),
            "iPage": Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
            "iTotalPages": Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
        };
    };
}
function customSearchObjectExtract(arrayObject) {
    var appendedRow = "";
    $.each(arrayObject, function(key, obj) {
        $.each(obj, function(k, o) {
            if (o.isCloning && o.isCloning == true) {
                var cloneid = (o.cloneId) ? o.cloneId : k;
                var cloned_elem = $("#" + cloneid).prop('outerHTML');
                if (typeof o.label != 'undefined') {
                    appendedRow += '' +
                        '<div class="search-form-inline no-border">' +
                        '<div class="input-group"><label class="control-label">' + o.label + ': </label></div>' +
                        '</div>';
                }
                var search_icon = "";
                if (typeof o.searchIcon != 'undefined' && o.searchIcon == true) {
                    search_icon = '<div class="input-group-text"><i class="fa fa-search text-primary"></i></div>';
                }
                if (typeof cloned_elem != 'undefined' && cloned_elem.length > 0) {
                    $("#" + cloneid).remove();
                    appendedRow += '' +
                        '<div class="search-form-inline no-border">' +
                        '<div class="input-group">' +
                        cloned_elem + search_icon +
                        '</div>' +
                        '</div>';
                }
            } else
            if ((o.isGroup && o.isGroup == false) || typeof o.isGroup == 'undefined') {
                var parentClass = (typeof o.parentClass != 'undefined') ? o.parentClass : '';
                appendedRow += '' +
                    '<div class="search-form-inline no-border padding-left-5">' +
                    '<div class="input-group">' +
                    '<div class="' + parentClass + '">' +
                    '<label class="inline-label label-checkbox">';
                if (o.labelBefore && o.labelBefore == true) {
                    appendedRow += o.label;
                }
                var elem_name = (typeof o.name != 'undefined') ? o.name : k;
                var elem_id = (typeof o.id != 'undefined') ? o.id : k;
                var isChecked = (typeof o.isChecked != 'undefined' && o.isChecked == true) ? "checked='checked'" : '';
                appendedRow += '<input type="' + o.inputType + '" name="' + elem_name + '" id="' + elem_id + '" value="' + o.value + '" ' + isChecked + '> ';
                if (o.labelAfter && o.labelAfter == true) {
                    appendedRow += o.label;
                }
                appendedRow += '' +
                    '</label>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            } else
            if (o.isGroup && o.isGroup == true) {
                var parentClass = (typeof o.parentClass != 'undefined') ? o.parentClass : '';
                appendedRow += '' +
                    '<div class="search-form-inline no-border padding-left-5">' +
                    '<div class="input-group">' +
                    '<div class="' + parentClass + '">' +
                    '<label class="inline-label pull-left">' + o.label + '</label>';
                $(o.data).each(function(i, s) {
                    var elem_name = (typeof s.name != 'undefined') ? s.name : k;
                    var elem_id = (typeof s.id != 'undefined') ? s.id : k + '_' + i;
                    var isChecked = (typeof s.isChecked != 'undefined' && s.isChecked == true) ? "checked='checked'" : '';
                    appendedRow += '' +
                        '<label class="">' +
                        '<input type="' + s.inputType + '" name="' + elem_name + '" id="' + elem_id + '" value="' + s.value + '" ' + isChecked + '"> ' + s.label +
                        '</label>';
                })
                appendedRow += '' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }
        })
    })
    return appendedRow;
}
var customSearch = function(tableid, extraFields, $tableDataAlias) {
    var appendedRow = "";
    if (extraFields != '' && typeof extraFields != 'undefined') {
        if (typeof extraFields != 'object') {
            Msg.error("extraFields in Searching datatable must be an object");
            console.log("extraFields must be an object")
        } else
        if (typeof extraFields.before != 'undefined') {
            appendedRow += customSearchObjectExtract(extraFields.before);
        }
    };
    $tableid = tableid;
    if ($($tableid + ' thead th.search').length > 0) {
        appendedRow += '' +
            '<div class="search-form-inline no-border">' +
            '<div class="input-group"><label class="control-label">Search: </label></div></div>';
    }
    $key_searching[$tableid]={};
    $($tableid + ' thead th.search').each(function(i, v) {
        var title = $(this).text();
        var width = (typeof $(this).attr('s-width') != 'undefined') ? $(this).attr('s-width') : $(this).width();
        var extra_class = ($(this).is('.datepicker')) ? 'datepicker' : '';
        var value = (typeof $(this).data("value") != 'undefined') ? $(this).data("value") : '';
        $key_searching[$tableid][i] = ($(this).data('name')) ? $(this).data('name') : '';
        title = (typeof $(this).data('placeholder') != 'undefined') ? $(this).data('placeholder') : title;
        appendedRow += '' +
            '<div class="search-form-inline no-border"><div class="no-padding no-border input-group" style="width: ' + width + '"><input type="text" class="form-control input-sm individu_search ' + extra_class + '" data-column="' + i + '" name="' + $key_searching[$tableid][i] + '" value="' + value + '" placeholder="' + title + '" /><div class="input-group-text"><i class="fa fa-search text-primary"></i></div></div></div>';
    });
    if (extraFields != '' && typeof extraFields != 'undefined') {
        if (typeof extraFields != 'object') {
            Msg.error("extraFields in Searching datatable must be an object");
            console.log("extraFields must be an object");
        } else
        if (typeof extraFields.after != 'undefined') {
            appendedRow += customSearchObjectExtract(extraFields.after)
        } else
        if (typeof extraFields.after == 'undefined' && typeof extraFields.before == 'undefined' && typeof extraFields == 'object') {
            appendedRow += customSearchObjectExtract(extraFields);
        }
    }
    if ($tableDataAlias != '' && typeof $tableDataAlias != 'undefined') $tableData = $tableDataAlias;
    $($tableid + "_filter").html($(appendedRow));
    $(".datepicker").datepicker({
        dateFormat: 'yy-mm-dd',
        autoclose: true,
        changeMonth: true,
        changeYear: true,
        // minDate: '-3m',
        // maxDate: '+1d',
        yearRange: '2014:' + (new Date).getFullYear(),
        datesDisabled: '+1d',
        todayBtn: true,
        todayHighlight: true,
        enableOnReadonly: true,
    });
    $(document)
        .on("keypress", $tableid + "_filter .individu_search", function(e) {
            if (e.which == 13) {
                if ($tableDataAlias != '' && typeof $tableDataAlias != 'undefined'){
                    $tableDataAlias.search('');
                    $($tableid + '_filter .individu_search').each(function() {
                        $tableDataAlias.column($(this).data('column')).search(this.value);
                    });
                    $tableDataAlias.draw();
                }else{
                    $tableData.search('');
                    $($tableid + '_filter .individu_search').each(function() {
                        $tableData.column($(this).data('column')).search(this.value);
                    });
                    $tableData.draw();    
                }

            }
        })
        .on("click", $tableid + " .search-form-inline .input-group-text", function() {
            $(this).parent().find('.individu_search').trigger({
                type: 'keypress',
                which: 13
            })
        })
        .on("click",".input-group-text",function(){
            $(this).parent().find('.individu_search').trigger({
                type: 'keypress',
                which: 13
            })  
        })
}
function number_format(amount){
    return amount.toString().replace(/(\d)(?=(\d{3})+\b)/g, "$1.");
}
function getDateTime() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds(); 
    if(month.toString().length == 1) {
         month = '0'+month;
    }
    if(day.toString().length == 1) {
         day = '0'+day;
    }   
    if(hour.toString().length == 1) {
         hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
         minute = '0'+minute;
    }
    if(second.toString().length == 1) {
         second = '0'+second;
    }   
    //var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
    var dateTime=hour+':'+minute+':'+second;
     return dateTime;
}// example usage: realtime clock
setInterval(function(){
currentTime = getDateTime();
    $(".current-datetime").html("<i class='fa fa-clock-o'></i> "+currentTime);
}, 1000);
