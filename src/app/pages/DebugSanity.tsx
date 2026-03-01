import { useState, useEffect } from 'react';
import { sanityService } from '../lib/sanity';
import { useLanguage } from '../contexts/LanguageContext';

export default function DebugSanity() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [residencies, setResidencies] = useState<any[]>([]);
  const [allArtists, setAllArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        console.log(`Fetching Sanity data for language: ${language}...`);
        
        const programsData = await sanityService.getAllPrograms(language);
        const residenciesData = await sanityService.getAllResidencies(language);
        
        console.log('Programs:', programsData);
        console.log('Residencies:', residenciesData);
        
        setPrograms(programsData || []);
        setResidencies(residenciesData || []);
        
        // Extract artists from residencies
        const artists: any[] = [];
        residenciesData.forEach((residency: any) => {
          if (residency.artists && residency.artists.length > 0) {
            residency.artists.forEach((item: any) => {
              if (!artists.some((a) => a._id === item.artist._id)) {
                artists.push(item.artist);
              }
            });
          }
        });
        setAllArtists(artists);
      } catch (err) {
        console.error('Error fetching:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#6A746C] text-[#F5F5F0] p-8">
        <h1 className="text-4xl mb-8">Loading Sanity Data...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#6A746C] text-red-400 p-8">
        <h1 className="text-4xl mb-8">Error</h1>
        <pre className="bg-black/20 p-4 rounded">{error}</pre>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#6A746C] text-[#F5F5F0] p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-['Cormorant_Garamond'] text-6xl italic">Sanity Debug</h1>
        
        {/* Language Switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded ${language === 'en' ? 'bg-[#B5DAD9] text-[#6A746C]' : 'bg-[#F5F5F0]/10 text-[#F5F5F0]'}`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('es')}
            className={`px-4 py-2 rounded ${language === 'es' ? 'bg-[#B5DAD9] text-[#6A746C]' : 'bg-[#F5F5F0]/10 text-[#F5F5F0]'}`}
          >
            ES
          </button>
        </div>
      </div>
      
      <div className="mb-12">
        <h2 className="text-3xl mb-4 text-[#B5DAD9]">Programs ({programs.length}) - Language: {language}</h2>
        <div className="space-y-6">
          {programs.length === 0 ? (
            <p className="text-[#F5F5F0]/60">No programs found</p>
          ) : (
            programs.map((program) => (
              <div key={program._id} className="bg-[#F5F5F0]/5 p-6 rounded border border-[#F5F5F0]/10">
                <h3 className="text-2xl mb-2">{program.name}</h3>
                <p className="text-sm text-[#F5F5F0]/60 mb-2">ID: {program._id}</p>
                <p className="text-sm text-[#F5F5F0]/60 mb-4">Slug: {program.slug}</p>
                <p className="text-sm text-yellow-300 mb-4">Language: {program.language || 'NOT SET'}</p>
                {program.tagline && <p className="mb-2 italic">{program.tagline}</p>}
                {program.capacity && <p>Capacity: {program.capacity}</p>}
                {program.location && <p>Location: {program.location}, {program.country}</p>}
                {program.disciplines && program.disciplines.length > 0 && <p>Disciplines: {program.disciplines.join(', ')}</p>}
                {program.gallery && <p>Gallery Images: {program.gallery.length}</p>}
                {program.editions && (
                  <div className="mt-4 p-4 bg-black/20 rounded">
                    <p className="text-[#B5DAD9] mb-2">Editions: {program.editions.length}</p>
                    {program.editions.map((ed: any) => (
                      <div key={ed.slug} className="ml-4 mb-2 text-sm">
                        <p>• Year: {ed.year}, Slug: {ed.slug}, Status: {ed.status}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Latest Edition Data */}
                {program.latestEdition && (
                  <div className="mt-4 p-4 bg-black/20 rounded">
                    <p className="text-[#B5DAD9] mb-2">Latest Edition:</p>
                    <p>Year: {program.latestEdition.year}</p>
                    <p>Status: {program.latestEdition.status}</p>
                    {program.latestEdition.gallery && (
                      <p>Gallery: {program.latestEdition.gallery.length} images</p>
                    )}
                    {program.latestEdition.selectedArtists && (
                      <div className="mt-2">
                        <p className="text-[#B5DAD9]">Selected Artists ({program.latestEdition.selectedArtists.length}):</p>
                        <ul className="ml-4 list-disc">
                          {program.latestEdition.selectedArtists.map((artist: any) => (
                            <li key={artist._id}>{artist.name} ({artist.nationality})</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                
                <details className="mt-4">
                  <summary className="cursor-pointer text-[#B5DAD9]">View Full Data</summary>
                  <pre className="mt-2 text-xs bg-black/20 p-4 rounded overflow-auto">
                    {JSON.stringify(program, null, 2)}
                  </pre>
                </details>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-3xl mb-4 text-[#B5DAD9]">Residencies ({residencies.length})</h2>
        <div className="space-y-6">
          {residencies.length === 0 ? (
            <p className="text-[#F5F5F0]/60">No residencies found</p>
          ) : (
            residencies.map((residency) => (
              <div key={residency._id} className="bg-[#F5F5F0]/5 p-6 rounded border border-[#F5F5F0]/10">
                <h3 className="text-2xl mb-2">{residency.title}</h3>
                <p className="text-sm text-[#F5F5F0]/60 mb-4">Slug: <span className="text-[#B5DAD9] font-bold">{residency.slug}</span></p>
                <p className="text-sm text-[#F5F5F0]/60 mb-2">Link: <a href={`/residencies/${residency.slug}`} className="text-[#B5DAD9] underline">/residencies/{residency.slug}</a></p>
                <p>Year: {residency.year}</p>
                <p>Status: {residency.status}</p>
                {residency.program && <p>Program: {typeof residency.program === 'string' ? residency.program : residency.program.name}</p>}
                {residency.gallery && <p>Gallery Images: {residency.gallery.length}</p>}
                
                {/* Artists Data */}
                {residency.artists && residency.artists.length > 0 && (
                  <div className="mt-4 p-4 bg-black/20 rounded">
                    <p className="text-[#B5DAD9] mb-2">Artists ({residency.artists.length}):</p>
                    <ul className="ml-4 list-disc">
                      {residency.artists.map((item: any) => (
                        <li key={item.artist._id}>
                          {item.artist.name} - {item.artist.nationality}
                          {item.artist.disciplines && ` (${item.artist.disciplines.join(', ')})`}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <details className="mt-4">
                  <summary className="cursor-pointer text-[#B5DAD9]">View Full Data</summary>
                  <pre className="mt-2 text-xs bg-black/20 p-4 rounded overflow-auto">
                    {JSON.stringify(residency, null, 2)}
                  </pre>
                </details>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Artists Section */}
      <div>
        <h2 className="text-3xl mb-4 text-[#B5DAD9]">Artists (From Residencies)</h2>
        <div className="space-y-6">
          {allArtists.length === 0 ? (
            <p className="text-[#F5F5F0]/60">No artists found</p>
          ) : (
            allArtists.map((artist) => (
              <div key={artist._id} className="bg-[#F5F5F0]/5 p-6 rounded border border-[#F5F5F0]/10">
                <h3 className="text-2xl mb-2">{artist.name}</h3>
                <p className="text-sm text-[#F5F5F0]/60 mb-4">Slug: <span className="text-[#B5DAD9] font-bold">{artist.slug}</span></p>
                <p className="text-sm text-[#F5F5F0]/60 mb-2">Link: <a href={`/artists/${artist.slug}`} className="text-[#B5DAD9] underline">/artists/{artist.slug}</a></p>
                {artist.nationality && <p>Nationality: {artist.nationality}</p>}
                {artist.disciplines && <p>Disciplines: {artist.disciplines.join(', ')}</p>}
                {artist.instruments && <p>Instruments: {artist.instruments.join(', ')}</p>}
                
                {/* Field Names Debug */}
                <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded">
                  <p className="text-yellow-300 mb-2 font-bold">🔍 Available Fields:</p>
                  <p className="text-xs text-yellow-200">
                    {Object.keys(artist).join(', ')}
                  </p>
                </div>
                
                <details className="mt-4">
                  <summary className="cursor-pointer text-[#B5DAD9]">View Full Data</summary>
                  <pre className="mt-2 text-xs bg-black/20 p-4 rounded overflow-auto">
                    {JSON.stringify(artist, null, 2)}
                  </pre>
                </details>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}