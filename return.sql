CREATE OR REPLACE FUNCTION return_rent (uname VARCHAR, title VARCHAR, format VARCHAR) RETURNS void AS $$
DECLARE
	r integer;

BEGIN
	r:= (SELECT anime_content.inventory_number FROM anime_content WHERE anime_content.title =$2 AND anime_content.format=$3);
	DELETE FROM rented_ass WHERE uname = rented_ass.username AND r = rented_ass.inventory_number;
	UPDATE anime_content SET num_stock = num_stock + 1 WHERE r=anime_content.inventory_number;
END;
$$ LANGUAGE plpgsql;