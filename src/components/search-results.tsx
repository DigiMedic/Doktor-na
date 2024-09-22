/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { SearchResult } from "@/schema/chat";

export const SearchResultsSkeleton = () => {
  return (
    <>
      <div className="flex flex-wrap w-full">
        {[...Array(4)].map((_, index) => (
          <div className="w-1/2 md:w-1/4 p-1" key={`skeleton-${index}`}>
            <Skeleton className="rounded-md shadow-none border-none h-[70px] bg-card " />
          </div>
        ))}
      </div>
    </>
  );
};

export const Logo = ({ url }: { url: string }) => {
  return (
    <div className="rounded-full overflow-hidden relative">
      <img
        className="block relative"
        src={`https://www.google.com/s2/favicons?sz=128&domain=${url}`}
        alt="favicon"
        width={16}
        height={16}
      />
    </div>
  );
};

export function SearchResults({ results }: { results: SearchResult[] }) {
  const [showAll, setShowAll] = useState(false);

  const displayedResults = showAll ? results : results.slice(0, 3);
  const additionalCount = results.length > 3 ? results.length - 3 : 0;

  return (
    <div className="flex flex-wrap w-full">
      {displayedResults.map(({ title, url, content, description, contact_info, druh_zarizeni, obor_pece, forma_pece, druh_pece, odborny_zastupce, address, services }, index) => {
        const formattedUrl = new URL(url).hostname.split(".").slice(-2, -1)[0];

        return (
          <HoverCard key={`source-${index}`}>
            <HoverCardTrigger asChild>
              <div className="w-1/2 md:w-1/4 p-1">
                <a className="" href={url} target="_blank" rel="noopener noreferrer">
                  <Card className="flex-1 rounded-md flex-col shadow-none border-none h-[120px]">
                    <CardContent className="p-2 flex flex-col justify-between h-full">
                      <p className="text-xs line-clamp-2 font-medium text-foreground/80">
                        {title} | {druh_zarizeni}
                      </p>
                      <p className="text-xs line-clamp-2 text-muted-foreground">
                        {obor_pece} | {forma_pece}
                      </p>
                      <div className="flex space-x-1">
                        <div className="flex items-center space-x-2">
                          <div className="rounded-full overflow-hidden relative">
                            <Logo url={url} />
                          </div>
                          <div className="text-xs text-muted-foreground truncate font-medium">
                            {formattedUrl}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 py-2">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-xs text-muted-foreground">{druh_zarizeni}</p>
                  <p className="text-xs text-muted-foreground">{obor_pece}</p>
                  <p className="text-xs text-muted-foreground">{forma_pece}</p>
                  <p className="text-xs text-muted-foreground">{druh_pece}</p>
                  <p className="text-xs text-muted-foreground">Odborný zástupce: {odborny_zastupce}</p>
                  <p className="text-xs text-muted-foreground">Kontakt: {contact_info}</p>
                  <p className="text-xs text-muted-foreground">Adresa: {address}</p>
                  <p className="text-xs text-muted-foreground">Služby: {services}</p>
                  <span className="text-sm line-clamp-3 font-light text-foreground/90">
                    {content}
                  </span>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        );
      })}
      {!showAll && additionalCount > 0 && (
        <div
          className="cursor-pointer w-1/2 md:w-1/4 p-1"
          onClick={() => setShowAll(true)}
        >
          <Card className="flex-1 rounded-md flex-col shadow-none border-none h-[120px] flex items-center justify-center">
            <CardContent>
              <p className="text-sm font-medium">Zobrazit dalších {additionalCount}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
