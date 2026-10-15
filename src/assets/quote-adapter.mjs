export async function submitQuote(endpoint, formData, fetchImplementation = globalThis.fetch) {
  if (!endpoint) throw new Error('Quote endpoint is not configured.');
  if (typeof fetchImplementation !== 'function') throw new Error('Fetch is unavailable.');
  const response = await fetchImplementation(endpoint,{ method:'POST', body:formData, headers:{ Accept:'application/json' } });
  if (!response?.ok) throw new Error('The quote handler rejected the request.');
  return response;
}
