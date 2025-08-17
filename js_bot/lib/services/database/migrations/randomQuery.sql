CREATE OR REPLACE FUNCTION my_random(m_table text, m_column text, m_value text, m_select text )
RETURNS text
LANGUAGE plpgsql AS $$
DECLARE
    result text;
    sql_query text;
BEGIN
  sql_query := format(
    'SELECT %I FROM %I WHERE %I = %L ORDER BY random() LIMIT 1',
     m_select, m_table, m_column, m_value
  );
  
    EXECUTE sql_query INTO result;
    RETURN result;
    END;
$$;