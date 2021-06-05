import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axios } from '../../config/constant';
import { Result } from 'antd';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function ResultConfirm(props) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: 'CLOSE_HEADER' });
    }, [])

    return (
        <div>
            <Result
                status="success"
                title="Thanh toán thành công"
                subTitle={"Đợi để quay lại trang chủ."}
                extra={[
                    <Link to='/'>
                        <Button>Trở về Trang Chủ</Button>
                    </Link>
                ]}>

            </Result>
        </div>
    )
}
