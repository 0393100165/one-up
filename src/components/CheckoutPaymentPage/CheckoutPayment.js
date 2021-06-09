import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axios } from '../../config/constant';
import { Steps, Radio, message, Breadcrumb } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import { Button, Navbar, Nav } from 'react-bootstrap';
import ids from 'short-id';
import { useCookies } from 'react-cookie';
import PaypalExpressBtn from 'react-paypal-express-checkout';

export default function CheckoutPayment() {
    const url = require('url');
    const querystring = require('querystring');
    const dispatch = useDispatch();
    const history = useHistory();
    const [dataGioHangNew, setDataGioHangNew] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies();
    const { Step } = Steps;
    // const { Option } = Select;
    const [valueRadioGiaoHang, setValueRadioGiaoHang] = useState(0);
    const [valueRadioThanhToan, setValueRadioThanhToan] = useState(0);
    const thongTinDatHang = useSelector(state => state.thongTinDatHang);
    const [total, setTotal] = useState(0);
    const [dataVoucher, setDataVoucher] = useState({
        idShow: '',
        loaiGiamGia: '',
        giaTriGiam: ''
    });

    const [idVoucher, setIdVoucher] = useState(localStorage.getItem('idVoucher'));
    const [dataGioHang, setDataGioHang] = useState(JSON.parse(localStorage.getItem('dataGioHang')));
    const steps = [
        {
            title: 'Đăng nhập',
        },
        {
            title: 'Địa chỉ giao hàng',
        },
        {
            title: 'Thanh toán & Đặt mua',
        },
    ];
    const [thongTinDonHang, setThongTinDonHang] = useState({
        idShow: '',
        thongTinNguoiMua: {
            hoTen: '',
            sdt: '',
            diaChi: ''
        },
        tongTien: '',
        soLuongSanPham: '',
        ngayTao: '',
        idVoucher: ''
    })

    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };

    const onSuccess = (payment) => {
        // Congratulation, it came here means everything's fine!
        console.log("The payment was succeeded!", payment);
        TaoDonHang_ThanhToan_PayPal(dataGioHangNew);
        // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
    }

    const onCancel = (data) => {
        // User pressed "cancel" or close Paypal's popup!
        console.log('The payment was cancelled!', data);
        // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
    }

    const onError = (err) => {
        // The main Paypal's script cannot be loaded or somethings block the loading of that script!
        console.log("Error!", err);
        // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
        // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
    }

    let env = 'sandbox'; // you can set here to 'production' for production
    let currency = 'USD'; // or you can set this value from your props or state
    // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/

    const client = {
        sandbox: 'AXtpVvNsxiOBjuWz-81KhPk5iMKn6XW6_N6CoDdIO-DjjtQj7Olq3HBdG98cci768r4NVim4uiOC1rXf',
        production: 'YOUR-PRODUCTION-APP-ID',
    }

    function format_curency(a) {
        a = a.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        return a;
    }

    function tinhThanhTien(tienTamTinh, dataVoucher, tienShip) {
        var tienGiam = 0;
        if (dataVoucher === '') {
            return tienTamTinh;
        } else {
            if (dataVoucher.loaiGiamGia === 0) {
                tienGiam = parseInt(dataVoucher.giaTriGiam);
                return parseInt(tienTamTinh - tienGiam - tienShip);
            } else {
                tienGiam = parseInt(tienTamTinh * dataVoucher.giaTriGiam / 100);
                return parseInt(tienTamTinh - tienGiam - tienShip);
            }
        }
    }

    function tinhTienMoiSanPham(giaCuoiCung, soLuong) {
        var tien = parseInt(giaCuoiCung * soLuong);
        return tien;

    }

    function getGioHangTheoIDUser() {
        var arrayGioHangNew = [];

        for (let index = 0; index < dataGioHang.length; index++) {
            if (dataGioHang[index].idUser === cookies.userID) {
                arrayGioHangNew.push({
                    giaCuoiCung: dataGioHang[index].giaCuoiCung,
                    giaGoc: dataGioHang[index].giaGoc,
                    idShop: dataGioHang[index].idShop,
                    idUser: dataGioHang[index].idUser,
                    img: dataGioHang[index].img,
                    khuyenMai: dataGioHang[index].khuyenMai,
                    mauSac: dataGioHang[index].mauSac,
                    size: dataGioHang[index].size,
                    soLuong: dataGioHang[index].soLuong,
                    ten: dataGioHang[index].ten,
                    tenShop: dataGioHang[index].tenShop,
                    index: index
                });
            }
        }

        setDataGioHangNew(arrayGioHangNew);
    }

    function tienTamTinh(data) {
        var tien = 0;
        for (let index = 0; index < data.length; index++) {
            tien += data[index].soLuong * data[index].giaCuoiCung;
        }
        return parseInt(tien);
    }

    function tinhTongSanPhamTrongGioHang(data) {
        var tong = 0;
        for (let index = 0; index < data.length; index++) {
            tong += data[index].soLuong;
        }
        return parseInt(tong);
    }

    async function KiemTraVoucher(voucherID) {
        if (idVoucher !== undefined) {
            let res = await axios.get('hethong/vouchers-item-show?idShow=' + voucherID);

            if (res.data.status === 'success') {
                setDataVoucher({
                    idShow: res.data.data.idShow,
                    loaiGiamGia: res.data.data.loaiGiamGia,
                    giaTriGiam: res.data.data.giaTriGiam
                });
            }
        }
    }

    async function TaoDonHang_ThanhToan_COD(dataGioHang) {
        let res = await axios.post('hethong/orders-them', {
            emailNhan: localStorage.getItem('email'),
            idShow: thongTinDonHang.idShow,
            thongTinNguoiMua: {
                hoTen: thongTinDonHang.thongTinNguoiMua.hoTen,
                sdt: thongTinDonHang.thongTinNguoiMua.sdt,
                diaChi: thongTinDonHang.thongTinNguoiMua.diaChi
            },
            tongTien: thongTinDonHang.tongTien,
            soLuongSanPham: thongTinDonHang.soLuongSanPham,
            hinhThucThanhToan: valueRadioThanhToan,
            ngayTao: thongTinDonHang.ngayTao,
            idUser: cookies.userID,
            idVoucher: thongTinDonHang.idVoucher,
            dataGioHang: dataGioHangNew
        });

        if (res.data.status === 'success') {
            message.success('Đã tạo đơn hàng thành công');
            localStorage.setItem('dataGioHang', '[]');
            localStorage.setItem('idVoucher', undefined);
            history.push('/checkout/payment/success/' + thongTinDonHang.idShow);
        } else {
            message.error('Đã tạo đơn hàng thất bại');
        }
    }

    async function TaoDonHang_ThanhToan_PayPal(dataGioHang) {
        let res = await axios.post('hethong/orders-them', {
            emailNhan: localStorage.getItem('email'),
            idShow: thongTinDonHang.idShow,
            thongTinNguoiMua: {
                hoTen: thongTinDonHang.thongTinNguoiMua.hoTen,
                sdt: thongTinDonHang.thongTinNguoiMua.sdt,
                diaChi: thongTinDonHang.thongTinNguoiMua.diaChi
            },
            tongTien: thongTinDonHang.tongTien,
            soLuongSanPham: thongTinDonHang.soLuongSanPham,
            hinhThucThanhToan: valueRadioThanhToan,
            ngayTao: thongTinDonHang.ngayTao,
            idUser: cookies.userID,
            idVoucher: thongTinDonHang.idVoucher,
            dataGioHang: dataGioHangNew
        });

        if (res.data.status === 'success') {
            message.success('Đã tạo đơn hàng thành công');
            history.push('/checkout/payment/success/' + thongTinDonHang.idShow);
            localStorage.setItem('dataGioHang', '[]');
            localStorage.setItem('idVoucher', undefined);
        } else {
            message.error('Đã tạo đơn hàng thất bại');
        }
    }

    async function ThanhToan_MoMo(dataGioHang) {
        let res = await axios.post('hethong/gw_payment/transactionProcessor', {
            amount: tinhThanhTien(tienTamTinh(dataGioHangNew), dataVoucher, 0).toString(),
            orderInfo: thongTinDonHang.idShow,
            emailNhan: localStorage.getItem('email'),
            idShow: thongTinDonHang.idShow,
            thongTinNguoiMua: {
                hoTen: thongTinDonHang.thongTinNguoiMua.hoTen,
                sdt: thongTinDonHang.thongTinNguoiMua.sdt,
                diaChi: thongTinDonHang.thongTinNguoiMua.diaChi
            },
            tongTien: thongTinDonHang.tongTien,
            soLuongSanPham: thongTinDonHang.soLuongSanPham,
            hinhThucThanhToan: valueRadioThanhToan,
            ngayTao: thongTinDonHang.ngayTao,
            idUser: cookies.userID,
            idVoucher: thongTinDonHang.idVoucher,
            dataGioHang: dataGioHangNew
        });
        if (res.data.status === 'success') {
            window.location.assign(res.data.data);
        } else {
            alert('Thanh toán MoMo thất bại');
        }
    }

    useEffect(() => {
        KiemTraVoucher(idVoucher);
        dispatch({ type: 'CLOSE_HEADER' });
        getGioHangTheoIDUser();
        if (thongTinDatHang.diaChi === '') {
            history.push('/checkout/shipping');
        }
    }, []);

    useEffect(() => {
        setThongTinDonHang({
            ...thongTinDonHang,
            idShow: 'ORDER-' + ids.generate().toUpperCase(),
            thongTinNguoiMua: {
                hoTen: thongTinDatHang.hoTen,
                sdt: thongTinDatHang.sdt,
                diaChi: thongTinDatHang.diaChi + ', phường ' + thongTinDatHang.phuong + ', ' + thongTinDatHang.quan + ', ' + thongTinDatHang.thanhPho
            },
            tongTien: tinhThanhTien(tienTamTinh(dataGioHangNew), dataVoucher, 0),
            soLuongSanPham: tinhTongSanPhamTrongGioHang(dataGioHang),
            ngayTao: new Date()
        })
        setTotal(parseInt(tinhThanhTien(tienTamTinh(dataGioHangNew), dataVoucher, 0) / 23300));
    }, [dataGioHangNew])

    return (
        <Fragment>
            <Navbar bg="light" expand="lg">
                <Navbar.Brand href="/">
                    <img
                        alt=""
                        src='/logo.png'
                        width="40"
                        height="40"
                        style={{ marginRight: 5 }}
                        className="d-inline-block"
                    />
                    <span style={{ fontWeight: 'bold', color: 'orange' }}>OneUp</span>
                </Navbar.Brand>
            </Navbar>
            <div className="container" style={{ height: 'auto', padding: 20 }}>
                <Breadcrumb>
                    <Breadcrumb.Item>
                        <a href="/">Trang Chủ</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="/" onClick={(e) => {
                            e.preventDefault();
                            window.location.pathname = 'checkout/cart';
                        }}>Giỏ hàng</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="/" onClick={(e) => {
                            e.preventDefault();
                            window.location.pathname = 'checkout/shipping';
                        }}>Địa chỉ giao hàng</a>
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        <a href="/" onClick={(e) => {
                            e.preventDefault();
                            window.location.pathname = 'checkout/payment';
                        }}>Thanh toán & Đặt mua</a>
                    </Breadcrumb.Item>
                </Breadcrumb>
                <br></br>
                <div className='col'>
                    <div>
                        <Steps current={2}>
                            {steps.map(item => (
                                <Step key={item.title} title={item.title} />
                            ))}
                        </Steps>
                    </div>
                    <br></br>
                    <br></br>
                    <div className='row'>
                        <div className='col-sm-9'>
                            <div>
                                <h6>1. Chọn hình thức giao hàng</h6>
                                <div style={{ height: 'auto', paddingLeft: 20 }}>
                                    <Radio.Group onChange={(e) => {
                                        setValueRadioGiaoHang(e.target.value);
                                    }} value={valueRadioGiaoHang}>
                                        <Radio style={radioStyle} value={0}>
                                            Giao hàng tiêu chuẩn
                                </Radio>

                                    </Radio.Group>
                                </div>
                            </div>

                            <div style={{ marginTop: 20 }}>
                                <h6>2. Chọn hình thức thanh toán</h6>
                                <div style={{ height: 'auto', paddingLeft: 20 }}>
                                    <Radio.Group onChange={(e) => {
                                        setValueRadioThanhToan(e.target.value);
                                    }} value={valueRadioThanhToan}>
                                        <Radio style={radioStyle} value={0}>
                                            Thanh toán tiền mặt khi nhận hàng
                                </Radio>
                                        <Radio style={radioStyle} value={1}>
                                            Thanh toán bằng Paypal
                                </Radio>
                                <Radio style={radioStyle} value={2}>
                                        Thanh toán bằng MoMo
                                </Radio>
                                    </Radio.Group>
                                </div>
                            </div>

                            <div style={{ marginTop: 20 }}>
                                <h6 style={{ color: 'gray' }}>Thông tin người mua</h6>
                                <div className='col' style={{ height: 'auto', paddingLeft: 20 }}>
                                    <div className='row'>
                                        <div className='col-sm-2'>
                                            <strong>Họ tên:</strong>
                                        </div>
                                        <div className='col-sm-6'>
                                            {thongTinDatHang.hoTen}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-sm-2'>
                                            <strong>Số điện thoại:</strong>
                                        </div>
                                        <div className='col-sm-6'>
                                            {thongTinDatHang.sdt}
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col-sm-2'>
                                            <strong>Địa chỉ:</strong>
                                        </div>
                                        <div className='col-sm-6'>
                                            {
                                                thongTinDatHang.diaChi + ', phường ' + thongTinDatHang.phuong + ', ' + thongTinDatHang.quan + ', ' + thongTinDatHang.thanhPho
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col' style={{ marginTop: 20 }}>
                                {
                                    valueRadioThanhToan === 0 && (
                                        // <Link to={'payment/success/' + thongTinDonHang.idShow} onClick={(e) => {

                                        <Button style={{ width: 300 }} variant="danger" size='lg'
                                            onMouseOver={() => {
                                                if (idVoucher.length > 0) {
                                                    setThongTinDonHang({
                                                        ...thongTinDonHang,
                                                        idVoucher: idVoucher
                                                    })
                                                }
                                            }}
                                            onClick={() => {
                                                TaoDonHang_ThanhToan_COD(dataGioHangNew);
                                            }}>ĐẶT MUA</Button>
                                    )
                                }

                                {
                                valueRadioThanhToan === 2 && (
                                    <Button style={{ width: 300 }} variant="danger" size='lg'
                                            onMouseOver={() => {
                                                if (idVoucher.length > 0) {
                                                    setThongTinDonHang({
                                                        ...thongTinDonHang,
                                                        idVoucher: idVoucher
                                                    })
                                                }
                                            }}
                                            onClick={() => {
                                                ThanhToan_MoMo(dataGioHang);
                                      
                                            }}>ĐẶT MUA</Button>
                                    )
                                }

                                {
                                    valueRadioThanhToan === 1 && (
                                        <Link to={'payment/success/' + thongTinDonHang.idShow} onClick={(e) => {
                                            //TaoDonHang(e, dataGioHang);
                                            e.preventDefault();
                                        }}
                                            onMouseOver={() => {
                                                if (idVoucher.length > 0) {
                                                    setThongTinDonHang({
                                                        ...thongTinDonHang,
                                                        idVoucher: idVoucher
                                                    })
                                                }
                                            }}>
                                            <PaypalExpressBtn
                                                env={env}
                                                client={client}
                                                currency={currency}
                                                total={total}
                                                onError={onError}
                                                onSuccess={onSuccess}
                                                onCancel={onCancel}
                                                style={{
                                                    size: 'large',
                                                    color: 'blue',
                                                    shape: 'rect',
                                                    label: 'checkout'
                                                }} />
                                        </Link>
                                    )
                                }

                                <br></br>
                                (Xin vui lòng kiểm tra lại đơn hàng trước khi Đặt mua)
                            </div>
                        </div>
                        <div className='col-sm-3' style={{ height: 'auto', backgroundColor: '#F8F9FA' }}>
                            <div className='row' style={{ padding: 10 }}>
                                <span>
                                    <strong>Đơn hàng ({tinhTongSanPhamTrongGioHang(dataGioHangNew)} sản phẩm)</strong> &nbsp;
                                <Link to='/checkout/cart'>Sửa</Link>
                                </span>

                            </div>
                            <hr style={{ marginTop: 5 }}></hr>
                            <div className='col'>
                                {
                                    dataGioHangNew.map((item, i) => {
                                        return <div className='row' key={i}>
                                            <div className='col-sm-8' style={{ height: 'auto', marginLeft: 0 }}>
                                                <strong>x{item.soLuong}</strong> {item.ten} {item.mauSac !== '' ? ' - ' + item.mauSac : ''} {item.size !== '' ? ' - ' + item.size : ''}
                                            </div>
                                            <div className='col-sm-4' style={{ paddingRight: 10 }}>
                                                <span style={{ float: 'right', fontWeight: 'bold' }}>{format_curency(tinhTienMoiSanPham(item.giaCuoiCung, item.soLuong).toString())}đ</span>
                                            </div>
                                        </div>
                                    })
                                }

                            </div>
                            <hr></hr>
                            <div className='col'>
                                <div className='row'>
                                    <div className='col-sm-8' style={{ height: 'auto', marginLeft: 0 }}>
                                        Tạm tính
                                </div>
                                    <div className='col-sm-4' style={{ paddingRight: 10 }}>
                                        <span style={{ float: 'right', fontWeight: 'bold' }}>{format_curency(tienTamTinh(dataGioHangNew).toString())}đ</span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-8' style={{ height: 'auto', marginLeft: 0 }}>
                                        Voucher
                                </div>
                                    <div className='col-sm-4' style={{ paddingRight: 10 }}>
                                        <span style={{ float: 'right', fontWeight: 'bold' }}>
                                            {dataVoucher.idShow !== '' && (
                                                dataVoucher.loaiGiamGia === 0 ? '-' + format_curency(dataVoucher.giaTriGiam.toString()) + 'đ' : '-' + dataVoucher.giaTriGiam + '%'
                                            )}
                                            {
                                                dataVoucher.idShow === '' && ('-0đ')
                                            }
                                        </span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-sm-8' style={{ height: 'auto', marginLeft: 0 }}>
                                        Phí vận chuyển
                                </div>
                                    <div className='col-sm-4' style={{ paddingRight: 10 }}>
                                        <span style={{ float: 'right', fontWeight: 'bold' }}>0đ</span>
                                    </div>
                                </div>
                            </div>
                            <hr></hr>
                            <div className='col'>
                                <div className='row'>
                                    <div className='col-sm-8' style={{ height: 'auto', marginLeft: 0 }}>
                                        Thành tiền
                                </div>
                                    <div className='col-sm-4' style={{ paddingRight: 10 }}>
                                        <span style={{ float: 'right', color: 'red', fontSize: 20, fontWeight: 'bold' }}>{format_curency(tinhThanhTien(tienTamTinh(dataGioHangNew), dataVoucher, 0).toString())}đ</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>

    )
}
