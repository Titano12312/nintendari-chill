
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nickname TEXT NOT NULL CHECK (char_length(nickname) BETWEEN 1 AND 40),
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anyone can post reviews" ON public.reviews FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.review_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL CHECK (char_length(nickname) BETWEEN 1 AND 40),
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 1000),
  is_staff BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX review_replies_review_id_idx ON public.review_replies(review_id);
GRANT SELECT, INSERT ON public.review_replies TO anon, authenticated;
GRANT ALL ON public.review_replies TO service_role;
ALTER TABLE public.review_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone can read replies" ON public.review_replies FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anyone can post replies" ON public.review_replies FOR INSERT TO anon, authenticated WITH CHECK (true);
