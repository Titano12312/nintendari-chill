
DROP POLICY IF EXISTS "anyone can post reviews" ON public.reviews;
CREATE POLICY "anyone can post reviews"
  ON public.reviews
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(btrim(nickname)) > 0
    AND char_length(btrim(content)) > 0
    AND rating BETWEEN 1 AND 5
  );

DROP POLICY IF EXISTS "anyone can post replies" ON public.review_replies;
CREATE POLICY "anyone can post replies"
  ON public.review_replies
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(btrim(nickname)) > 0
    AND char_length(btrim(content)) > 0
    AND is_staff = false
  );
