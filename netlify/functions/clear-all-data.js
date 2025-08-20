// 文件路径: /netlify/functions/clear-all-data.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async function(event) {
  // 为安全起见，只允许 POST 方法执行此危险操作
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // *** 核心修改：现在只删除 'reports' 表中的数据 ***
    const { error } = await supabase
      .from('reports')
      .delete()
      .neq('id', -1); // .neq('id', -1) 是一个删除所有行的技巧

    if (error) {
      throw new Error(`清空报工记录失败: ${error.message}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: '所有报工记录已成功清空！' })
    };

  } catch (error) {
    console.error('清空报工数据时发生错误:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
