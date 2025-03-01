
export const addCart = async ( data: any): Promise<any> => {
    try {
        return {
            status: true,
            message: 'Thêm thành công vào giỏ hàng',
        };
    } catch (error: any) {
        return {
            status: false,
            message: 'Lổi thêm vào giỏ hàng',
        };
    }
}