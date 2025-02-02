import React, { useEffect, useState, useRef } from 'react';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import { WrapperButtonMore, WrapperTypeProduct, HomePageContainer, CardsContainer, SectionTitle, PromoBanner, NeedSection } from './style';
import slider1 from '../../assets/img/mau-banner-quang-cao-san-pham-15.jpg';
import slider2 from '../../assets/img/6383710935847606737329161.jpg';
import slider3 from '../../assets/img/th.jpg';
import slider4 from '../../assets/img/banner-quang-cao-dien-thoai_103211774.jpg';
import CardComponent from '../../components/CardComponent/CardComponent';
import { useNavigate } from 'react-router-dom';
import AdvertisementComponent from '../../components/AdvertisementComponent/AdvertisementComponent';
import FooterComponent from '../../components/FooterComponent/FooterComponent';
import Chatbot from '../../components/Chatbot/Chatbot';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService';
import { useSelector } from 'react-redux';
import { FontSizeOutlined } from '@ant-design/icons';

const HomePage = () => {
    const searchProduct = useSelector((state) => state.product.search); // Lấy từ Redux state
    const navigate = useNavigate();
    const [showAd, setShowAd] = useState(true);
    const [stateProduct, setStateProduct] = useState([]);
    const [typeProduct, setTypeProduct] = useState([]);
    const [isExpanded, setIsExpanded] = useState(false); // Trạng thái mở rộng danh sách
    const refSearch = useRef(false); // Dùng để kiểm soát lần render đầu tiên
    const refWrapper = useRef(null); // Tham chiếu vùng danh sách loại sản phẩm

    // Fetch toàn bộ sản phẩm hoặc theo từ khóa tìm kiếm
    const fetchAllProduct = async (search = '') => {
        const response = await ProductService.getProductAll(search);
        return response.data;
    };

    // Fetch sản phẩm mới (8 sản phẩm mới nhất)
    const fetchNewProducts = async () => {
        try {
            const response = await ProductService.getProductAll();
            if (!Array.isArray(response.data)) {
                throw new Error('Response data is not an array');
            }
            // Sắp xếp theo id tăng dần và lấy 8 sản phẩm mới nhất
            return response.data.sort((a, b) => a.id - b.id).slice(-8);
        } catch (error) {
            console.error('Error fetching new products:', error);
            return [];
        }
    };

    // Fetch sản phẩm bán chạy (8 sản phẩm bán chạy nhất)
    const fetchBestSellingProducts = async () => {
        const response = await ProductService.getProductAll();
        return response.data.sort((a, b) => b.sales - a.sales).slice(0, 8);
    };

    // Fetch sản phẩm đánh giá cao (4 sản phẩm có rating cao nhất)
    const fetchTopRatedProducts = async () => {
        const response = await ProductService.getProductAll();
        return response.data.sort((a, b) => b.rating - a.rating).slice(0, 4);
    };

    // Fetch toàn bộ loại sản phẩm
    const fetchAllTypeProduct = async () => {
        const response = await ProductService.getAllType();
        if (response.status === 'OK') {
            setTypeProduct(response.data);
        }
    };

    useEffect(() => {
        fetchAllTypeProduct();
    }, []);

    // Xử lý theo dõi thay đổi từ Redux state searchProduct
    useEffect(() => {
        if (refSearch.current) {
            const fetchData = async () => {
                const response = await fetchAllProduct(searchProduct);
                setStateProduct(response || []);
            };
            fetchData();
        } else {
            refSearch.current = true;
        }
    }, [searchProduct]);

    // Lắng nghe sự kiện click bên ngoài danh sách loại sản phẩm
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refWrapper.current && !refWrapper.current.contains(event.target)) {
                setIsExpanded(false); // Thu gọn danh sách
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Fetch dữ liệu với React Query
    const { data: newProducts, isLoading: isLoadingNew, error: errorNew } = useQuery({
        queryKey: ['newProducts'],
        queryFn: fetchNewProducts,
    });
    const { data: bestSellingProducts, isLoading: isLoadingBestSelling, error: errorBestSelling } = useQuery({
        queryKey: ['bestSellingProducts'],
        queryFn: fetchBestSellingProducts,
    });
    const { data: topRatedProducts, isLoading: isLoadingTopRated, error: errorTopRated } = useQuery({
        queryKey: ['topRatedProducts'],
        queryFn: fetchTopRatedProducts,
    });

    // Xử lý khi người dùng đóng quảng cáo
    const handleCloseAd = () => setShowAd(false);

    // Xử lý điều hướng đến trang danh mục
    const handleCategory = () => {

    };

    // Xử lý điều hướng đến chi tiết sản phẩm
    const handleProductDetail = (id) => navigate(`/product/details/${id}`);

    // Xử lý nhấn "Xem thêm"
    const handleToggleExpand = () => setIsExpanded(true);

    // Lấy danh sách loại sản phẩm cần hiển thị
    const displayedTypes = isExpanded ? typeProduct : typeProduct.slice(0, 6);

    if (isLoadingNew || isLoadingBestSelling || isLoadingTopRated) return <div>Đang tải...</div>;
    if (errorNew || errorBestSelling || errorTopRated) return <div>Lỗi: {errorNew?.message || errorBestSelling?.message || errorTopRated?.message}</div>;

    return (
        <>
            {showAd && <AdvertisementComponent onClose={handleCloseAd} />}
            <HomePageContainer className={showAd ? 'blur' : ''}>
                {/* Banner khuyến mãi */}
                <PromoBanner>🔥 Giảm giá lên đến 50% cho sản phẩm điện tử!</PromoBanner>

                {/* Loại sản phẩm */}
                <WrapperTypeProduct
                    ref={refWrapper}
                    style={{
                        fontSize: '20px',
                        marginRight: '10px',
                        marginBottom: '10px',
                        display: 'flex',
                        flexWrap: 'wrap',
                    }}
                >
                    {displayedTypes.map((item, index) => (
                        <TypeProduct
                            name={item}
                            key={index}
                            style={{
                                flex: '1 0 calc(12.5% - 10px)', // Chiều rộng tối đa cho mỗi item (8 items trên mỗi dòng)
                                marginRight: '10px',
                                marginBottom: '10px',
                            }}
                        />
                    ))}
                    {typeProduct.length > 6 && !isExpanded && (
                        <span
                            onClick={handleToggleExpand}
                            style={{
                                cursor: 'pointer',
                                color: '#007bff',
                                fontWeight: 'bold',
                                marginLeft: '10px',
                            }}
                        >
                            Xem thêm
                        </span>
                    )}
                </WrapperTypeProduct>



                {searchProduct ? (
                    // Hiển thị kết quả tìm kiếm
                    <div className="container">
                        <NeedSection>
                            <SectionTitle>🌟 Sản Phẩm Bạn Quan Tâm</SectionTitle>
                            <CardsContainer>
                                {stateProduct.map((product) => (
                                    <CardComponent
                                        key={product.id}
                                        product={product}
                                        onClick={() => handleProductDetail(product.id)}
                                    />
                                ))}
                            </CardsContainer>
                        </NeedSection>
                    </div>
                ) : (
                    // Hiển thị sản phẩm nổi bật
                    <div className="container">
                        {/* Slider */}
                        <SliderComponent arrImages={[slider1, slider2, slider3, slider4]} />

                        {/* Sản phẩm mới */}
                        <NeedSection>
                            <SectionTitle>🌟 Sản Phẩm Mới</SectionTitle>
                            <CardsContainer>
                                {newProducts?.map((product) => (
                                    <CardComponent
                                        key={product.id}
                                        product={product}
                                        onClick={() => handleProductDetail(product.id)}
                                    />
                                ))}
                            </CardsContainer>
                        </NeedSection>

                        {/* Sản phẩm bán chạy */}
                        <NeedSection>
                            <SectionTitle>🔥 Sản Phẩm Bán Chạy</SectionTitle>
                            <CardsContainer>
                                {bestSellingProducts?.map((product) => (
                                    <CardComponent
                                        key={product.id}
                                        product={product}
                                        onClick={() => handleProductDetail(product.id)}
                                    />
                                ))}
                            </CardsContainer>
                        </NeedSection>

                        {/* Sản phẩm đánh giá tốt nhất */}
                        <NeedSection>
                            <SectionTitle>⭐ Sản Phẩm Được Đánh Giá Tốt Nhất</SectionTitle>
                            <CardsContainer>
                                {topRatedProducts?.map((product) => (
                                    <CardComponent
                                        key={product.id}
                                        product={product}
                                        onClick={() => handleProductDetail(product.id)}
                                    />
                                ))}
                            </CardsContainer>
                        </NeedSection>
                    </div>
                )}

                {/* <div className="see-more">
                    <WrapperButtonMore onClick={handleCategory} textButton="Xem thêm" type="outline" styleTextButton={{ fontWeight: '500' }} />
                </div> */}
            </HomePageContainer>
            <Chatbot />
            <FooterComponent />
        </>
    );
};

export default HomePage;
