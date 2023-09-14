'use client'
import { useEffect, useState } from 'react'
import { request, gql } from 'graphql-request'

type Country = {
  name: string
  code: string
  awsRegion: string
}

const endpoint = 'https://countries.trevorblades.com/'

const query = gql`
  {
    countries {
      name
      code
      awsRegion
    }
  }
`

export default function Home() {
  const [countries, setCountries] = useState<Country[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const colors = ['blue', 'green', 'orange', 'pink', 'gray', 'yellow', 'purple'];
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  useEffect(() => {
    async function fetchCountries() {
      const data = await request<{ countries: Country[] }>(endpoint, query)
      setCountries(data.countries)
    }
    
    fetchCountries()
  }, [])

  useEffect(() => {
    if (countries.length > 0) {
      setSelectedCountry(countries[9]);
    }
  }, [countries]);

  const filterCountries = (searchTerm: string) => {
    if (!searchTerm) {
      // Eğer boş bir arama yapılırsa tüm ülkeleri göster
      return countries;
    }
    return countries.filter(country => {
      return (
        country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        country.code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };
  const filteredCountries = filterCountries(searchTerm);
  const countriesByRegion: { [key: string]: Country[] } = {};
  countries.forEach(country => {
    const region = country.awsRegion;

    if (!countriesByRegion[region]) {
      countriesByRegion[region] = [];
    }

    countriesByRegion[region].push(country);
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-black text-white">
      <input
        type="text"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="border rounded p-2 mb-4 text-black"
      />
      {Object.entries(countriesByRegion).map(([region, countries]) => (
        <div key={region} className="mb-4">
          <h2 className="text-3xl font-extrabold mb-2 border-b border-gray-400 ">{region}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCountries.map(country => (
              <div
                key={country.code}
                onClick={() => {
                  if (selectedCountry === country) {
                    setSelectedCountry(null);
                  } else {
                    setSelectedCountry(country);
                    setSelectedColorIndex((selectedColorIndex + 1) % colors.length);
                  }
                }}
                style={{ backgroundColor: selectedCountry === country ? colors[selectedColorIndex] : 'transparent' }}
                className={`rounded p-4 cursor-pointer `}
              >
                <h2 className="text-lg font-medium">{country.name}</h2>
                <p className="text-sm text-gray-500">{country.code} - {country.awsRegion}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
);
}





