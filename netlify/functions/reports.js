// 文件路径: /netlify/functions/reports.js

import { createClient } from '@supabase/supabase-js';

// 从 Netlify 的环境变量中安全地获取 Supabase 的连接信息
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// 这是 Netlify Functions 处理所有请求的标准函数
exports.handler = async function(event, context) {
  
  // -- 处理 GET 请求 (用于获取所有报工数据) --
  if (event.httpMethod === 'GET') {
    try {
      // 使用 Supabase 客户端从 'reports' 表中查询所有数据 (*)
      // 并按照 'timestamp' 字段倒序排列，让最新的数据显示在最前面
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('timestamp', { ascending: false });

      // 如果查询过程中发生错误，就抛出它
      if (error) throw error;

      // 如果成功，返回 200 状态码和 JSON 格式的数据
      return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      };
    } catch (error) {
      // 如果捕获到任何错误，返回 500 状态码和错误信息
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
    }
  } 
  
  // -- 处理 POST 请求 (用于新增一条报工数据) --
  else if (event.httpMethod === 'POST') {
    try {
      // Netlify 将前端发来的 JSON 数据存储在 event.body 中，需要手动解析
      const reportData = JSON.parse(event.body);
      
      // 使用 Supabase 客户端将前端发来的数据插入到 'reports' 表中
      const { data, error } = await supabase
        .from('reports')
        .insert(reportData);

      if (error) throw error;

      // 如果成功，返回 201 (Created) 状态码和一个成功消息
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
