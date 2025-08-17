import discord
import logging
import os
from discord.ext import commands
from dotenv import load_dotenv


load_dotenv()
token = os.getenv("DISCORD_TOKEN")

#basic loggins
handler = logging.FileHandler(filename= "discord.log", encoding= "utf-8", mode= "w")

#specify intents
intents = discord.Intents.default()

#enable the intents manually
intents.message_content = True
intents.members = True

#create the bot, prefix is customizable
bot = commands.Bot(command_prefix= "!pp", intents= intents)

#handling events
#initialize
@bot.event
async def on_ready():
    print(f"OMG {bot.user.name} TOTALLY WOKEEEE")

#on message
@bot.event
async def on_message(message):
    #only check messages with the prefix
    if bot.command_prefix in message.content:
        #prevent infine looping(dont respond self messages)
        if message.author == bot.user:
            return
        
        if "flo" in message.content.lower():
            #await message.channel.send(f"{message.author.mention} ur such a cutie patootie ❤️")
            await message.channel.send(content = "so cute", file= discord.File("flotuxedoinc.jpg"))

    #process the next messages
    await bot.process_commands(message)

@bot.command()
async def hello(ctx):
    await ctx.send(f"Hello {ctx.author.mention}! I'm your CUTE fluffy pics provider")

#run bot
bot.run(token, log_handler= handler, log_level= logging.DEBUG)