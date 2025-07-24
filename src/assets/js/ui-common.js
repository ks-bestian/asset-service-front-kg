//
// 공통 UI 제어
//

$(document).ready(function () {
	// Sidebar
	$('.lnb_area .depth2').each(function () {
		$(this).css('display', 'none');
	});
	$('.lnb_area .collapse.on').each(function () {
		$(this).find('.depth2').css('display', 'block');
	});

	$(document).on('click', '.lnb_area .collapse > a', function (e) {
		e.preventDefault();
		$(this).next('ul').slideToggle('fast').parent('li').toggleClass('on');
	})
	// .on('click', '.btn_sidebar', function (e) {
	// 	e.preventDefault();
	// 	$(this).parent('#v_sidebar').toggleClass('open');
	// });

	
	//quickmenu 드래그
	let isDragging = false;
	let hasMoved = false;
	let startY = 0;
	let startTop = 0;

	$(document).on('mousedown', '.btn_quickmenu', function (e) {
		isDragging = true;
		hasMoved = false;
		startY = e.clientY;
		startTop = $('.btn_quickmenu').offset().top;
		$('body').css('user-select', 'none'); // 드래그 중 텍스트 선택 방지
	});

	$(document).on('mousemove', function (e) {
		if (!isDragging) return;
		const dy = e.clientY - startY - 65;

		if (Math.abs(dy) > 3) {
		hasMoved = true;
		}

		$('.btn_quickmenu').css('top', startTop + dy + 'px');
	});

	$(document).on('mouseup', function () {
		isDragging = false;
		$('body').css('user-select', '');
	});


	// Quickmenu
	$(document).on('click', '.btn_quickmenu', function (e) {
		if(hasMoved) {
			return;
		}
		e.preventDefault();
		e.stopImmediatePropagation();

		$('#v_quickmenu').removeClass('close');
	}).on('click', '.btn_quick_close', function () {
		$('#v_quickmenu').addClass('close');
	});

	// 탭메뉴
	$(document).on('click', '.tab_list a', function (e) {
		var tg = $(this).attr('href');
		$(this).parent('li').addClass('on').siblings('li').removeClass('on');
		$(tg).show().siblings('.tab_cont').hide();
		e.preventDefault();
	});

	// 상세 펼치기/닫기
	$('.btn_accordion').click(function () {
		$(this).parent('.accordion_item').toggleClass('open');
	});

	// 등록 - 파일첨부
	$(document).on('change', '.form_file', function () {
		if (window.FileReader) {
			// var filename = $(this)[0].files[0].name;
			var files = $(this)[0].files;
			var filename = '';
			for(var i = 0; i < files?.length; ++i) {
				if(i > 0) {
					filename += ', ';
				}
				filename += files[i].name;
			}
		} else {
			var filename = $(this).val().split('/').pop().split('\\').pop();
		}
		$(this).next('.file_name').val(filename);
	});
	$(document).on('click', '.file_attatch .file_name', function () {
		$(this).prev('.form_file').click();
	});

	// 드롭다운
	$(document).on('click', '.dropdown_menu .dropdown_btn, .dropdown_list .v_btn', function () {
		$(this).closest('.dropdown_menu').toggleClass('on');
		return false;
	}).on('click', 'html', function (e) {
		if ($('.dropdown_menu').has(e.target).length === 0) {
			$('.dropdown_menu').removeClass('on');
		}
	});
});

// 레이어 팝업
$(function () {
	$('.layer_popup.show').each(function () {
		openModal($(this), null);
	});
});
// $(document).on('click', '.layer_popup .btn_close_popup', function () {
// 	var target = $(this).closest('.layer_popup').attr('id');
// 	closeModal('#' + target);
// });
function openModal(_target) {
	if ($(_target).length > 0) {
		$(_target).appendTo('body');
		$('body').addClass('layer_open');
		setTimeout(function () {
			$(_target).addClass('show').removeClass('hide');
		}, 100);
	}
}
function closeModal(_target) {
	$(_target).addClass('hide').removeClass('show');
}

// 윈도우 팝업
var popOpenBtn = null;
function openWindow(_obj, popName, w, h, _opener) {
	var popW = 800;
	var popH = 500;
	var myUrl = _obj;
	if (typeof _obj !== 'string') {
		if ($(_obj).prop('tagName') === 'A') {
			popOpenBtn = $(_obj);
			myUrl = $(_obj).attr('href');
		} else if (_opener) {
			popOpenBtn = $(_opener);
		}
	}
	if (w) popW = w;
	if (h) popH = h;
	var left = window.screenX + (window.outerWidth - popW) / 2;
	var top = window.screenY + (window.outerHeight - popH) / 2;
	window.open(myUrl, popName, 'width=' + popW + ', height=' + popH + ', left=' + left + ', top=' + top + ', scrollbars=yes');
}
function closeWindow() {
	window.close();
}
