export const normalizeApiMessage = (message: string) => {
  const trimmedMessage = message.trim();

  const stockMatch = trimmedMessage.match(
    /^Insufficient stock for product '(.+?)'\.\s*Available:\s*(\d+),\s*Requested:\s*(\d+)(?:,\s*Max allowed:\s*(\d+))?\.?$/i,
  );

  if (stockMatch) {
    const [, productName, available, requested, maxAllowed] = stockMatch;

    if (maxAllowed) {
      return `Sản phẩm "${productName}" hiện chỉ còn ${available} sản phẩm trong kho. Bạn đang chọn ${requested} sản phẩm, số lượng tối đa có thể đặt là ${maxAllowed}.`;
    }

    return `Sản phẩm "${productName}" chỉ còn ${available} sản phẩm trong kho. Bạn đang chọn ${requested} sản phẩm.`;
  }

  const giftBoxStockMatch = trimmedMessage.match(
    /^Insufficient stock for GiftBox '(.+?)'\.\s*Limiting component '(.+?)' has (\d+) in stock,\s*requires (\d+) per box\.\s*Requested:\s*(\d+) boxes \((\d+) units\),\s*Max allowed:\s*(\d+) boxes\.?$/i,
  );

  if (giftBoxStockMatch) {
    const [
      ,
      giftBoxName,
      componentName,
      availableUnits,
      unitsPerBox,
      requestedBoxes,
      requestedUnits,
      maxAllowedBoxes,
    ] = giftBoxStockMatch;

    return `Hộp quà "${giftBoxName}" hiện chưa đủ số lượng để đáp ứng yêu cầu của bạn. Thành phần giới hạn là "${componentName}" hiện còn ${availableUnits} sản phẩm, mỗi hộp cần ${unitsPerBox} sản phẩm. Bạn đang chọn ${requestedBoxes} hộp (${requestedUnits} sản phẩm), tối đa có thể đặt ${maxAllowedBoxes} hộp.`;
  }

  const productUnavailableMatch = trimmedMessage.match(
    /^Product '(.+?)' is no longer available\.$/i,
  );

  if (productUnavailableMatch) {
    const [, productName] = productUnavailableMatch;
    return `Sản phẩm "${productName}" hiện không còn kinh doanh.`;
  }

  const giftBoxUnavailableMatch = trimmedMessage.match(
    /^GiftBox '(.+?)' is no longer available\.$/i,
  );

  if (giftBoxUnavailableMatch) {
    const [, giftBoxName] = giftBoxUnavailableMatch;
    return `Hộp quà "${giftBoxName}" hiện không còn kinh doanh.`;
  }

  const staticMessageMap: Record<string, string> = {
    "Cart is empty or not found.": "Giỏ hàng đang trống hoặc không tồn tại.",
    "No items selected for checkout.":
      "Vui lòng chọn sản phẩm trước khi thanh toán.",
    "Voucher not found.": "Không tìm thấy mã giảm giá.",
    "Voucher has expired or is inactive.":
      "Mã giảm giá đã hết hạn hoặc đang bị vô hiệu hóa.",
    "Voucher usage limit exceeded.":
      "Mã giảm giá này đã hết lượt sử dụng.",
    "Invalid user token.": "Phiên đăng nhập không hợp lệ.",
  };

  return staticMessageMap[trimmedMessage] ?? trimmedMessage;
};

export const getErrorMessage = (
  error: unknown,
  fallback = "Đã xảy ra lỗi.",
) => {
  if (typeof error === "string") {
    return normalizeApiMessage(error);
  }

  const axiosLikeError = error as {
    response?: {
      data?: {
        message?: string;
        errors?: Record<string, string[]>;
      };
    };
    message?: string;
  };

  const validationErrors = axiosLikeError?.response?.data?.errors;
  if (validationErrors && typeof validationErrors === "object") {
    const messages = Object.values(validationErrors)
      .flat()
      .filter(Boolean);

    if (messages.length > 0) {
      return messages.map(normalizeApiMessage).join("\n");
    }
  }

  const rawMessage =
    axiosLikeError?.response?.data?.message ||
    axiosLikeError?.message ||
    fallback;

  return normalizeApiMessage(rawMessage);
};
