/**
 * 业务成功的返回值
 * @param data 请求返回的数据
 * @param message 请求返回的信息
 * @param code 请求返回的标志code
 */
export function resultSuccess(data: any, message = "success", code = 200) {
	return { code, data, message };
}

/**
 * 业务失败的返回值（注意不是请求失败）
 * @param data 请求返回的数据
 * @param message 请求返回的信息
 * @param code 请求返回的标志code
 */
export function resultError(data: any, message = "failed", code = 400) {
	return { code, data, message };
}

/**
 * 列表分页的返回值
 * @param page 页码
 * @param limit 一页多少条数据
 * @param list 总的数据列表
 */
export function pageResultSuccess(page: number, limit: number, list: any[]) {
	const pageData = pagination(page, limit, list);
	return resultSuccess({
		data: pageData,
		total: list.length,
		page,
		limit,
	});
}

/**
 * 根据分页参数截取列表数据
 * @param page 页码
 * @param limit 一页多少条数据
 * @param list 总的数据列表
 */
function pagination(page: number, limit: number, list: any[]) {
	const offset = (page - 1) * limit;
	return offset + limit >= list.length ? list.slice(offset, list.length) : list.slice(offset, offset + limit);
}
