// 文件路径: /netlify/functions/reports.js

// --- 这是唯一的修改！我们将 import 替换为 require ---
const { createClient } = require('@supabase/supabase-js');

// 从 Netlify 的环境变量中安全地获取 Supabase 的连接信息
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 这是 Netlify Functions 处理所有请求的标准函数
exports.handler = async function(event, context) {
  
  // -- 处理 GET 请求 (用于获取所有报工数据) --
  if (event.httpMethod === 'GET') {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  } 
  
  // -- 处理 POST 请求 (用于新增一条报工数据) --
  else if (event.httpMethod === 'POST') {
    try {
      const reportData = JSON.parse(event.body);
      
      const { data, error } = await supabase
        .from('reports')
        .insert(reportData);

      if (error) throw error;

      return {
        statusCode: 201,
        body: JSON.stringify({ success: true, data: data }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  } 
  
  // -- 如果是其他类型的请求, 则返回不被允许 --
  else {
    return {
      statusCode: 405,
      body: `Method ${event.httpMethod} Not Allowed`,
    };
  }
};
