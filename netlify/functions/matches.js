// 文件路径: /netlify/functions/matches.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

exports.handler = async function(event, context) {
  if (event.httpMethod === 'GET') {
    try {
      const { data, error } = await supabase
        .from('material_matches')
        .select('*');

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
  else {
    return {
      statusCode: 405,
      body: `Method ${event.httpMethod} Not Allowed`,
    };
  }
};
