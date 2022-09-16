CREATE OR REPLACE FUNCTION rent (uname VARCHAR, title VARCHAR, format VARCHAR) RETURNS void AS $$

DECLARE
	r integer;

BEGIN
	r:= (SELECT anime_content.inventory_number FROM anime_content WHERE anime_content.title =$2 AND anime_content.format=$3);
	IF format='Digital'
	THEN
		INSERT INTO rented_ass (username, inventory_number, due_date) VALUES (uname, r, (current_timestamp + interval '30 days'));
	ELSE
		INSERT INTO rented_ass (username, inventory_number, due_date) VALUES (uname, r, (current_timestamp + interval '40 days'));
	END IF;

	UPDATE anime_content SET num_stock = num_stock - 1 WHERE r=anime_content.inventory_number;
END;
$$ LANGUAGE plpgsql;