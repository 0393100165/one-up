import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axios } from '../../config/constant';
import { Result } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ids from 'short-id';
import { useCookies } from 'react-cookie';
export default function ResultConfirm(props) {
    const dispatch = useDispatch();
    const search = useLocation().search;
    const hoTen = new URLSearchParams(search).get('hoTen');
    const sdt = new URLSearchParams(search).get('sdt');
    const diaChi = new URLSearchParams(search).get('diaChi');
    const orderId = new URLSearchParams(search).get('idShow');
    const [dataGioHangNew, setDataGioHangNew] = useState([]);
    const [cookies, setCookie, removeCookie] = useCookies();
    const thongTinDatHang = useSelector(state => state.thongTinDatHang);
    const [total, setTotal] = useState(0);
    const [dataVoucher, setDataVoucher] = useState({
        idShow: '',
        loaiGiamGia: '',
        giaTriGiam: ''
    });

    const [idVoucher, setIdVoucher] = useState(localStorage.getItem('idVoucher'));
    const [dataGioHang, setDataGioHang] = useState(JSON.parse(localStorage.getItem('dataGioHang')));
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

    async function TaoDonHang_ThanhToan_MoMo() {
        
        if( total != 0 && dataGioHang != '' &&  orderId != '' && dataGioHangNew != '') {
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
                hinhThucThanhToan: 2,
                ngayTao: thongTinDonHang.ngayTao,
                idUser: cookies.userID,
                idVoucher: thongTinDonHang.idVoucher,
                dataGioHang: dataGioHangNew
            });
                localStorage.setItem('dataGioHang', '[]');
                localStorage.setItem('idVoucher', undefined);
        }
    }
      useEffect(() => {
        KiemTraVoucher(idVoucher);
        dispatch({ type: 'CLOSE_HEADER' });
        getGioHangTheoIDUser();
    }, []);

    useEffect(() => {
        setThongTinDonHang({
            ...thongTinDonHang,
            idShow: orderId,
            thongTinNguoiMua: {
                hoTen: hoTen,
                sdt: sdt,
                diaChi: diaChi
            },
            tongTien: tinhThanhTien(tienTamTinh(dataGioHangNew), dataVoucher, 0),
            soLuongSanPham: tinhTongSanPhamTrongGioHang(dataGioHang),
            ngayTao: new Date()
        });
        setTotal(parseInt(tinhThanhTien(tienTamTinh(dataGioHangNew), dataVoucher, 0) / 23300));
    }, [dataGioHangNew], TaoDonHang_ThanhToan_MoMo())

    return (
        <div >
            <Result 
                status="success"
                title="Thanh toán thành công"
                subTitle={"Từ bây giờ bạn có xem đơn hàng của bạn." }
                extra={[
                    <Link to='/' >
                        <Button> Trở về Trang Chủ</Button>
                    </Link>
                ]}>
            </Result>
            
        </div>
    )
}
