var ipPrefix_msg = "";
var ipPools_msg = "";
$.extend($.fn.validatebox.defaults.rules, {
	eqPassword : {
		validator : function(value, param) {
			return value == $(param[0]).val();
		},
		message : '密码不一致！'
	},
	phoneRex : {
		validator : function(value) {
			var rex = /^1[3-8]{1}\d{9}$/, flag = false;
			if (rex.test(value)) {
				flag = true;
			}
			return flag;
		},
		message : '请输入正确手机格式'
	},
	alpNum_ : {
		validator : function(value) {
			var rex = /^\w+$/, flag = false;
			if (rex.test(value)) {
				flag = true;
			}
			return flag;
		},
		message : '只能包含字母,数字,下划线'
	},
	alpCheNum_ : {
		validator : function(value) {
			var rex = /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, flag = false;
			if (rex.test(value)) {
				flag = true;
			}
			return flag;
		},
		message : '只能包含字母,数字,中文,下划线'
	},
	valIP : {
		validator : function(value) {
			if (new RegExp(
					"^" + "(?!(?:127)(?:\\.\\d{1,3}){3})"
							+ "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])"
							+ "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}"
							+ "(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))"
							+ "(\/([8-9]|[1-2][0-9]|3([0]|[2])))?" + "(-"
							+ "(?!(?:127)(?:\\.\\d{1,3}){3})"
							+ "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])"
							+ "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}"
							+ "(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))"
							+ "(\/([8-9]|[1-2][0-9]|3([0]|[2])))?" + ")?" + "$",
					"i").test(value)) {
				var networkadds = value.split("-");
				if (networkadds.length == 1) {
					var network_address = networkadds[0].split("/");
					var ip = network_address[0];
					var masklen = 32;
					if (network_address.length > 1) {
						masklen = network_address[1];
					}
					var ipnet = ip.split(".");
					var net = Number(ipnet[0]) * 256 * 256 * 256
							+ Number(ipnet[1]) * 256 * 256 + Number(ipnet[2])
							* 256 + Number(ipnet[3]);
					net = net >>> 0;
					net = net & 0xFFFFFFFF;
					var mask = 0;
					if (masklen > 0) {
						mask = (((2 << masklen - 1) - 1) << (32 - masklen))
								& 0xFFFFFFFF;
					}

					if ((net & mask) === net) {
						return true;
					} else {
						return false;
					}
				} else if (networkadds.length == 2) {
					if (networkadds[0] == networkadds[1]) {
						return false;
					}

					var network_address1 = networkadds[0].split("/");
					var network_address2 = networkadds[1].split("/");

					var ip1 = network_address1[0];
					var ip2 = network_address2[0];

					var masklen1 = 32;
					if (network_address1.length > 1) {
						masklen1 = network_address1[1];
					}

					var masklen2 = 32;
					if (network_address2.length > 1) {
						masklen2 = network_address2[1];
					}

					if (masklen1 != masklen2) {
						return false;
					}

					var ipnet1 = ip1.split(".");
					var net1 = Number(ipnet1[0]) * 256 * 256 * 256
							+ Number(ipnet1[1]) * 256 * 256 + Number(ipnet1[2])
							* 256 + Number(ipnet1[3]);
					net1 = net1 >>> 0;
					net1 = net1 & 0xFFFFFFFF;
					var mask1 = 0xFFFFFFFF;
					if (masklen1 > 0) {
						mask1 = (((2 << masklen1 - 1) - 1) << (32 - masklen1))
								& 0xFFFFFFFF;
					}

					var ipnet2 = ip2.split(".");
					var net2 = Number(ipnet2[0]) * 256 * 256 * 256
							+ Number(ipnet2[1]) * 256 * 256 + Number(ipnet2[2])
							* 256 + Number(ipnet2[3]);
					net2 = net2 >>> 0;
					net2 = net2 & 0xFFFFFFFF;
					var mask2 = 0xFFFFFFFF;
					if (masklen2 > 0) {
						mask2 = (((2 << masklen2 - 1) - 1) << (32 - masklen2))
								& 0xFFFFFFFF;
					}

					h1 = Number(ipnet1[0]);
					h2 = Number(ipnet2[0]);
					if ((h1 < 127) && (h2 > 127)) {
						return false;
					}

					if (h1 > h2) {
						return false;
					} else if (h1 == h2) {
						r1 = Number(ipnet1[1]) * 256 * 256 + Number(ipnet1[2])
								* 256 + Number(ipnet1[3]);
						r2 = Number(ipnet2[1]) * 256 * 256 + Number(ipnet2[2])
								* 256 + Number(ipnet2[3]);
						if (r1 > r2) {
							return false;
						}
					}

					if ((net1 & mask1) !== net1) {
						return false;
					}

					if ((net2 & mask2) !== net2) {
						return false;
					}

					return true;
				} else {
					return false;
				}
			} else {
				return false;
			}
		},
		message : 'IP地址非法,多个IP地址请用;分隔'
	},
	ipPrefix : {
		message : function() {
			return ipPrefix_msg + ',请输入"IP(/mask)"';
		},
		validator : function(value) {
			ipPrefix_msg = "";
			var _ipPrefix_mask = value.split('/');
			if (_ipPrefix_mask.length != 2) {
				ipPrefix_msg = '网段格式不正确';
				return false;
			}
			var _ipPrefix = _ipPrefix_mask[0];
			var _len = _ipPrefix_mask[1];
			if (!pearl.reg.IPv4.test(_ipPrefix)) {
				ipPrefix_msg = '地址段非法';
				return false;
			}
			if (!pearl.reg.len.test(_len)) {
				ipPrefix_msg = '掩码为8-30 或者 32';
				return false;
			}
			return true;
		}
	},
	ip_Pools : {
		message : function() {
			return ipPools_msg + ',请输入IP或[start IP]-[end IP] 逗号(,)分割';
		},
		validator : function(value, _index) {
			// 去掉 所有 <br> \n ' '
			var _ipPools = value.replaceAll('<br>', '').replaceAll('\n', '')
					.replaceAll(' ', '');
			var ipSegs = _ipPools.split(',');
			var _segDtos = [];
			var _i = 1;
			var _checkIP = true;
			ipSegs.forEach(function(_ipSeg) {
						var _ips = _ipSeg.split('-');
						var _ip0 = _ips[0];
						var _ip1 = _ips[1];
						if (_ip0 && !_ip1) {
							if (!pearl.reg.IPv4.test(_ip0)) {
								ipPools_msg = 'IP' + _ip0 + '非法', '提示';
								_checkIP = false;
								return;
							}
						} else if (_ip0 && _ip1) {
							if (!pearl.reg.IPv4.test(_ip0)) {
								ipPools_msg = 'IP' + _ip0 + '非法', '提示';
								_checkIP = false;
								return;
							}
							if (!pearl.reg.IPv4.test(_ip1)) {
								ipPools_msg = 'IP' + _ip1 + '非法', '提示';
								_checkIP = false;
								return;
							}
						} else {
							ipPools_msg = 'IP' + _ipSeg + '非法', '提示';
							_checkIP = false;
							return;
						}
					});
			if (!_checkIP) {
				return false;
			}
			return true;
		}
	}
});

/** 输入的combobox值要是没有，则清除 */
function comboVali() {
	var valueField = $(this).combobox("options").valueField;
	var val = $(this).combobox("getValue"); // 当前combobox的值
	var allData = $(this).combobox("getData"); // 获取combobox所有数据
	var result = true; // 为true说明输入的值在下拉框数据中不存在
	for (var i = 0; i < allData.length; i++) {
		if (val == allData[i][valueField]) {
			result = false;
		}
	}
	if (result) {
		$(this).combobox("clear");
	}
}

/** 输入的combobox值要是没有，则清除，然后执行callback */
function comboValiAndCallback($self, callback) {
	var valueField = $self.combobox("options").valueField;
	var val = $self.combobox("getValue"); // 当前combobox的值
	var allData = $self.combobox("getData"); // 获取combobox所有数据
	var result = true; // 为true说明输入的值在下拉框数据中不存在
	for (var i = 0; i < allData.length; i++) {
		if (val == allData[i][valueField]) {
			result = false;
		}
	}
	if (result) {
		$self.combobox("clear");
		callback();
	}
}