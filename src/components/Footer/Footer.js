import React from 'react';

function Footer() {
    return (
        <footer className="page-footer font-small mdb-color lighten-3 pt-4" style={{ marginTop: 100, backgroundColor: '#F8F9FA' }}>
            <div className="container text-center text-md-left">
                <div className="row">
                    <div className="col-md-4 col-lg-3 mr-auto my-md-4 my-0 mt-4 mb-1s">
                        <h5 className="font-weight-bold text-uppercase mb-4">OneUp - WEBSITE MUA SẮM HÀNG ĐẦU</h5>
                        <span style={{ fontSize: 14 }}>Mua hàng trực tuyến (mua hàng online) mang lại sự tiện lợi, lựa chọn đa dạng hơn và các dịch vụ tốt hơn cho người tiêu dùng, thế nhưng người tiêu dùng Việt Nam vẫn chưa tận hưởng được những tiện ích đó. Chính vì vậy OneUp được triển khai với mong muốn trở thành trung tâm mua sắm trực tuyến số 1 tại Việt Nam, nơi bạn có thể chọn lựa mọi thứ, từ các mặt hàng điện tử như laptop, điện thoại di động giá rẻ, thiết bị gia dụng như máy lạnh, máy lọc không khí, máy hút bụi mini gia đình, nội thất phòng ngủ… Chúng tôi có tất cả!</span>
                    </div>
                    <hr className="clearfix w-100 d-md-none" />
                    <div className="col-md-4 col-lg-3 mr-auto my-md-4 my-0 mt-4 mb-1s">
                        <span style={{ fontSize: 14 }}>Tại OneUp bạn có thể mua đồ điện tử giá rẻ, cũng như các loại mặt hàng khác với rất nhiều các chương trình khuyến mãi hàng tháng. Ngoài ra bạn cũng có thể tham gia bán hàng trực tuyến thông qua hệ thống marketplace của OneUp với rất nhiều hỗ trợ và dịch vụ hấp dẫn. Bây giờ bạn có thể trải nghiệm mua hàng online thỏa thích mà OneUp mang lại chỉ với 1 click chuột. Dù bạn là một nhà quản lý bận rộn với công việc hay là người nội trợ với danh sách dài việc phải làm, chắc chắn bạn cũng sẽ yêu thích trải nghiệm mua hàng tại OneUp - mua hàng trực tuyến dễ dàng hơn, thuận tiện hơn và tiết kiệm thời gian.</span>
                    </div>
                    <hr className="clearfix w-100 d-md-none" />
                    <div className="col-md-4 col-lg-3 mx-auto my-md-4 my-0 mt-4 mb-1">
                        <h5 className="font-weight-bold text-uppercase mb-4">Address</h5>
                        <ul className="list-unstyled">
                            <li>
                                <p>
                                    <i className="fa fa-home mr-2" /> Gò Vấp, HCM</p>
                            </li>
                            <li>
                                <p>
                                    <i className="fa fa-envelope mr-2" />oneup290421@gmail.com</p>
                            </li>
                            <li>
                                <p>
                                    <i className="fa fa-phone mr-2" />0584378737</p>
                            </li>
                        </ul>
                    </div>
                    <hr className="clearfix w-100 d-md-none" />
                    <div className="col-md-2 col-lg-2 text-center mx-auto my-4">
                        <h5 className="font-weight-bold text-uppercase mb-4">Follow Us</h5>
                        <a href='https://www.facebook.com' type="button" className="btn-floating btn-fb">
                            <i className="fab fa-facebook-square fa-2x mr-3" />
                        </a>
                        <a href='https://www.instagram.com' type="button" className="btn-floating btn-tw">
                            <i className="fab fa-instagram fa-2x mr-3" />
                        </a>
                    </div>
                </div>
            </div>
            <div className="footer-copyright text-center py-3">© 2020 Copyright: OneUp
            </div>
        </footer>
    );
}

export default Footer;