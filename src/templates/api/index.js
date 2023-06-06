import { BaseApi } from '@/tlw/core';
import axios from '@/axios';

class Api extends BaseApi {

}

export default new Api({
  /**
   * 数据表标题字段
   * 注：数据埋点数据标题，搜索显示标题，删除数据提示的用的字段
   * 如：myTitle
   */
  titleField: '',

  /**
   * 接口名称
   * 注：一定要与数据表备注一样，用于数据埋点显示的操作对象
   * 如：用户
   */
  tableComment: '',

  /**
   * 路由基础地址
   * 暂时不用baseUrl
   */
  baseUrl: '',
});
