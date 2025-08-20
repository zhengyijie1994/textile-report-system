// 文件路径: /netlify/functions/machines.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async function(event, context) {
  const { httpMethod, body, queryStringParameters } = event;

  // -- 处理 GET 请求 (获取所有设备) --
  if (httpMethod === 'GET') {
    try {
      const { data, error } = await supabase
        .from('machines')
        .select('*')
        .order('created_at', { ascending: false }); // 按创建时间排序

      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify(data) };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
  }

  // -- 处理 POST 请求 (新增一台设备) --
  else if (httpMethod === 'POST') {
    try {
      const newMachine = JSON.parse(body);
      const { data, error } = await supabase.from('machines').insert(newMachine).select();

      if (error) throw error;
      return { statusCode: 201, body: JSON.stringify(data) };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
  }

  // -- 处理 DELETE 请求 (删除一台设备) --
  else if (httpMethod === 'DELETE') {
    try {
      // 从URL查询参数中获取要删除的设备ID
      const { machine_id } = queryStringParameters;
      if (!machine_id) {
        return { statusCode: 400, body: JSON.stringify({ error: 'machine_id is required' }) };
      }

      const { error } = await supabase.from('machines').delete().eq('machine_id', machine_id);

      if (error) throw error;
      return { statusCode: 200, body: JSON.stringify({ success: true, deleted_id: machine_id }) };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
  }
  
  // -- 其他方法不允许 --
  else {
    return { statusCode: 405, body: `Method ${httpMethod} Not Allowed` };
  }
};
